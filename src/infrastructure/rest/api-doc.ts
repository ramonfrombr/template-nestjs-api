import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { ErrorResponse } from '../model/exception.model';

export const ERRO_422_API_RESPONSE: ApiResponseOptions = {
  type: ErrorResponse,
  status: HttpStatus.UNPROCESSABLE_ENTITY,
};

export const ERRO_401_API_RESPONSE: ApiResponseOptions = {
  type: ErrorResponse,
  status: HttpStatus.UNAUTHORIZED,
};

export const ERRO_500_API_RESPONSE: ApiResponseOptions = {
  type: ErrorResponse,
  status: HttpStatus.INTERNAL_SERVER_ERROR,
};
