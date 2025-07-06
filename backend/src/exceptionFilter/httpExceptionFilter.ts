import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      error: true,
      data: {
        timestamp: new Date().toISOString(),
        statusCode: status,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : typeof exceptionResponse === 'object' &&
                'message' in exceptionResponse
              ? (exceptionResponse as { message: string }).message
              : undefined,
      },
    };

    response.status(status).json(errorResponse);
  }
}
