import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponse } from './exception.model';

@Catch()
export class ExceptionHandler implements ExceptionFilter<Error> {
  private readonly logger = new Logger(ExceptionHandler.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    this.logException(exception, path);
    if (exception instanceof ServiceUnavailableException) {
      httpAdapter.reply(
        ctx.getResponse(),
        exception.getResponse(),
        exception.getStatus(),
      );
    } else {
      const responseBody = ErrorResponse.of(exception);

      httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.status);
    }
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
