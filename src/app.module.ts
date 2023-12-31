import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV !== 'production'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        port: Number(configService.get('DATABASE_PORT')),
        schema: configService.get('DATABASE_SCHEMA'),
        entities: [`${__dirname}/**/*.entity{.js,.ts}`],
        migrations: [`${__dirname}/infrastructure/db/migrations/*{.js,.ts}`],
        migrationsRun: Boolean(configService.get('MIGRATIONS_RUN')),
        synchronize: false,
        logging: Boolean(configService.get('DATABASE_LOG')),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'TEMPLATE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'template',
            brokers: [process.env.KAFKA_BROKERS],
          },
          consumer: {
            groupId: 'template-consumer',
          },
        },
      },
    ]),
    HealthCheckModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
