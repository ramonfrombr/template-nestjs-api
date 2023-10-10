import {
  Controller,
  Inject,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  ClientKafka,
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AlgoAconteceuEvent } from './event';
import { EventoRepository } from './event.repository';

@Controller()
export class ListenerController implements OnModuleInit, OnModuleDestroy {
  protected readonly logger = new Logger(ListenerController.name);

  constructor(
    @Inject('KAFKA_CLIENT_TEST') private readonly client: ClientKafka,
    private readonly repository: EventoRepository,
  ) {}

  @MessagePattern('dry-evento.algo-aconteceu')
  async listen(
    @Payload() message: AlgoAconteceuEvent,
    @Ctx() context: KafkaContext,
  ) {
    this.logger.log(`func=listen data=${JSON.stringify(message)}`);
    this.repository.salvar(message);
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await this.client.commitOffsets([{ topic, partition, offset }]);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
