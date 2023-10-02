import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from './exception.model';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    this.logException(exception, request.path);

    response
      .status(status)
      .json(
        status === HttpStatus.SERVICE_UNAVAILABLE
          ? exception.getResponse()
          : ErrorResponse.of(exception),
      );
  }

  private logException(exception: Error, path: any) {
    if (exception instanceof HttpException) {
      this.logger.error(
        `path=${path} status=${exception.getStatus()} response=${JSON.stringify(
          exception.getResponse(),
        )}`,
      );
    } else {
      this.logger.error(`path=${path}`, exception);
    }
  }
}
