import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './infrastructure/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: parseInt(process.env.SERVER_TCP_PORT, 10),
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS],
      },
      run: {
        autoCommit: false,
      },
    },
  });
  const config = new DocumentBuilder()
    .setTitle('Template - Backend - Web')
    .setDescription('API do Template')
    .setVersion('1.0')
    .addApiKey(
      {
        name: ApiKeyGuard.API_KEY_HEADER,
        type: 'apiKey',
        in: 'header',
      },
      ApiKeyGuard.API_KEY_HEADER,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.use(helmet());
  await Promise.all([
    app.startAllMicroservices(),
    app.listen(process.env.SERVER_HTTP_PORT),
  ]);
}
bootstrap();
