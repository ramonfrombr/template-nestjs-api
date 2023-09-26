import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './application/health-check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [HealthCheckController],
  imports: [TypeOrmModule, TerminusModule],
})
export class HealthCheckModule {}
