import { Injectable, Logger } from '@nestjs/common';
import { AlgoAconteceuEvent } from './event';
import { LoggerUtils } from '@/infrastructure/utils/utils';

@Injectable()
export class EventoRepository {
  private logger = new Logger(EventoRepository.name);
  salvar(evento: AlgoAconteceuEvent) {
    this.logger.log(`func=salvar evento=${LoggerUtils.stringify(evento)}`);
    //
  }
}
