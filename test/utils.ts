import { AppModule } from '@/app.module';
import { Faker, pt_BR } from '@faker-js/faker';
import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import {
  Admin,
  Consumer,
  Kafka,
  KafkaMessage,
  Partitioners,
  Producer,
  ProducerRecord,
  logLevel,
} from 'kafkajs';
import * as path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
  Wait,
} from 'testcontainers';
import { DataSource } from 'typeorm';
import { EventoRepository } from './event/event.repository';
import { ListenerController } from './event/listener.controller';

const environment = new DockerComposeEnvironment(
  `${path.resolve('./')}`,
  'docker-compose.test.yml',
)
  .withNoRecreate()
  .withWaitStrategy('database_test', Wait.forListeningPorts())
  .withWaitStrategy('zookeeper_test', Wait.forListeningPorts())
  .withWaitStrategy('kafka_test', Wait.forListeningPorts())
  .withWaitStrategy(
    'mockserver_test',
    Wait.forLogMessage('INFO 1080 started on port: 1080'),
  );
let containersInstances: StartedDockerComposeEnvironment;

export async function startContainer() {
  containersInstances = await environment.up();
}

export async function stopContainer() {
  await containersInstances.down();
}

export function appModuleBuilder(): TestingModuleBuilder {
  return Test.createTestingModule({
    controllers: [ListenerController],
    imports: [
      AppModule,
      ClientsModule.registerAsync({
        clients: [
          {
            name: 'KAFKA_CLIENT_TEST',
            useFactory: (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: 'microservice-client-id',
                  brokers: [configService.get('KAFKA_BROKERS')],
                },
                consumer: {
                  groupId: 'dry_api_gateway_pagamento_consumer_test',
                },
                run: {
                  autoCommit: false,
                },
              },
            }),
            inject: [ConfigService],
          },
        ],
      }),
    ],
    providers: [ProducerService, EventoRepository],
  });
}

export async function resetarBancoDeDados(app: INestApplication) {
  const dataSource = app.get(DataSource);
}

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProducerService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly admin: Admin;
  private readonly consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:29092'],
      logLevel: logLevel.NOTHING,
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    this.admin = this.kafka.admin();
    this.consumer = this.kafka.consumer({
      groupId: 'dry_api_gateway_pagamento_consumer_test',
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.admin.connect();
    await this.consumer.connect();
    const topics = await this.admin.listTopics();
    this.logger.log(`topics=[${topics}]`);
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    await this.admin.disconnect();
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.consumer.subscribe({
      topic: record.topic,
    });
    let resolveOnConsumption: (messages: KafkaMessage[]) => void;
    let rejectOnError: (e: Error) => void;

    const returnThisPromise = new Promise<KafkaMessage[]>((resolve, reject) => {
      (resolveOnConsumption = resolve), (rejectOnError = reject);
    }).finally(() => this.consumer.disconnect());
    const messages: KafkaMessage[] = [];
    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ message, partition, topic }) => {
        try {
          if (messages.length < record.messages.length) {
            messages.push(message);
            await this.consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);
          }
          if (messages.length === record.messages.length) {
            resolveOnConsumption(messages);
          }
        } catch (e) {
          rejectOnError(e);
        }
      },
    });
    await this.producer.send(record);
    return returnThisPromise;
  }
}

export const faker = new Faker({
  locale: pt_BR,
});
