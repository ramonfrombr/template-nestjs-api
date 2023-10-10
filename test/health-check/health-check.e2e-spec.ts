import { AppModule } from '@/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { startContainer, stopContainer } from 'Tests/utils';
import * as request from 'supertest';

describe('Health check', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await startContainer();
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close(), stopContainer()]);
  });

  it('QUANDO a rota de health check é requisitada ENTÃO uma resposta de sucesso deve ser retornada', () => {
    return request(app.getHttpServer())
      .get('/health/check')
      .expect(HttpStatus.OK)
      .expect((response) => {
        expect(response.body.status).toBe('ok');
        expect(response.body.info.database.status).toBe('up');
      });
  });

  it('QUANDO a rota de health check é requisitada MAS o banco de dados está offline ENTÃO uma resposta de erro deve ser retornada', async () => {
    await stopContainer();
    const response = await request(app.getHttpServer()).get('/health/check');
    expect(response.statusCode).toEqual(HttpStatus.SERVICE_UNAVAILABLE);
    expect(response.body.status).toEqual('error');
    expect(response.body.details.database.status).toEqual('down');
  });
});
