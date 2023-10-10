import { Logger } from '@nestjs/common';
import { ApiResponse, ApiSecurity } from '@nestjs/swagger';
import {
  ERRO_401_API_RESPONSE,
  ERRO_422_API_RESPONSE,
  ERRO_500_API_RESPONSE,
} from './api-doc';
import { ApiKeyGuard } from '../guards/api-key.guard';

@ApiResponse(ERRO_401_API_RESPONSE)
@ApiResponse(ERRO_422_API_RESPONSE)
@ApiResponse(ERRO_500_API_RESPONSE)
@ApiSecurity(ApiKeyGuard.API_KEY_HEADER)
export abstract class BaseController {
  protected readonly logger = new Logger(this.name);

  constructor(private readonly name: string) {}
}
