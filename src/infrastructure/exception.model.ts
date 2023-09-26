import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 'Erro interno no servidor' })
  readonly message: string;

  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  readonly status: number;

  private constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
  static of(exception: any) {
    if (exception instanceof BaseException) {
      return new ErrorResponse(
        exception.message,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isHttpException = exception instanceof HttpException;
    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttpException
      ? exception.message
      : 'Não foi possível processar sua solicitação';
    return new ErrorResponse(message, httpStatus);
  }
}

export class BaseException extends Error {
  constructor(message: string) {
    super(message);
  }
}
