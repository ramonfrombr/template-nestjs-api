import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TestingModule } from '@nestjs/testing';
import {
  ProducerService,
  appModuleBuilder,
  faker,
  startContainer,
  stopContainer,
} from 'Tests/utils';
import { EventoRepository } from './event.repository';

describe('Base de testes com eventos', () => {
  let app: INestApplication;
  let producer: ProducerService;
  const repositoryMock = {
    salvar: jest.fn(),
  };

  beforeAll(async () => {
    await startContainer();

    const moduleRef: TestingModule = await appModuleBuilder()
      .overrideProvider(EventoRepository)
      .useValue(repositoryMock)
      .compile();
    app = moduleRef.createNestApplication({
      logger: new Logger(),
    });
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'microservice-client-id',
          brokers: ['localhost:29092'],
        },
        run: {
          autoCommit: false,
        },
      },
    });
    app.enableShutdownHooks();
    await app.startAllMicroservices();
    await app.init();
    producer = app.get(ProducerService);
  });

  afterAll(async () => {
    await app.close();
    await stopContainer();
  });

  it('QUANDO um evento é enviado ENTÃO o evento deve manuseado', async () => {
    const descricao = faker.person.jobDescriptor();
    const message = {
      key: faker.string.uuid(),
      value: JSON.stringify({
        descricao,
      }),
    };
    await producer.produce({
      topic: 'dry-evento.algo-aconteceu',
      messages: [message],
    });
    expect(repositoryMock.salvar).toBeCalledWith({ descricao });
  });
});
