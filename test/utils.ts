import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { DataSource } from 'typeorm';

const dbContainer = new GenericContainer('postgres:15.3-alpine');
dbContainer
  .withEnvironment({
    POSTGRES_USER: 'db_user',
    POSTGRES_PASSWORD: 'db_pass',
    POSTGRES_DB: 'db_name',
    TZ: process.env.TZ,
  })
  .withExposedPorts({
    container: 5432,
    host: 5433,
  })
  .withReuse()
  .withWaitStrategy(Wait.forListeningPorts());

let containerInstance: StartedTestContainer;

export async function startContainer() {
  containerInstance = await dbContainer.start();
}

export async function stopContainer() {
  if (containerInstance) {
    await containerInstance.stop({ remove: true, removeVolumes: true });
  }
}

export function appModuleBuilder(): TestingModuleBuilder {
  return Test.createTestingModule({
    imports: [AppModule],
  });
}

export async function resetarBancoDeDados(app: INestApplication) {
  const dataSource = app.get(DataSource);
  //   await Promise.all([]);
}
