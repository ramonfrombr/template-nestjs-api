import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './infrastructure/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
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
  SwaggerModule.setup('api', app, document);
  app.use(helmet());
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
