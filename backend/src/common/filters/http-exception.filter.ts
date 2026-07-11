import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

import { ErrorResponse } from '../responses/error.response';

interface HttpRequest {
  method?: string;
  url?: string;
  originalUrl?: string;
}

type HttpResponse = object;

interface ExceptionBody {
  statusCode?: number;
  code?: string;
  message?: string | string[];
  error?: string;
  errors?: unknown;
}

interface ResolvedException {
  statusCode: number;
  code: string;
  message: string;
  errors?: unknown;
}

interface PostgresDriverError {
  code?: string;
  constraint?: string;
  detail?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();

    const request = httpContext.getRequest<HttpRequest>();

    const response = httpContext.getResponse<HttpResponse>();

    const { httpAdapter } = this.httpAdapterHost;

    const resolvedException = this.resolveException(exception);

    const method = request.method ?? 'UNKNOWN';

    const path = request.originalUrl ?? request.url ?? '';

    const errorResponse = new ErrorResponse({
      statusCode: resolvedException.statusCode,

      code: resolvedException.code,

      message: resolvedException.message,

      errors: resolvedException.errors,

      method,

      path,
    });

    if (
      resolvedException.statusCode >= Number(HttpStatus.INTERNAL_SERVER_ERROR)
    ) {
      this.logger.error(
        `${method} ${path} - ${resolvedException.statusCode} - ${resolvedException.message}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    httpAdapter.reply(response, errorResponse, resolvedException.statusCode);
  }

  private resolveException(exception: unknown): ResolvedException {
    if (exception instanceof HttpException) {
      return this.resolveHttpException(exception);
    }

    if (exception instanceof QueryFailedError) {
      return this.resolveQueryFailedError(exception as QueryFailedError<Error>);
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,

      code: 'INTERNAL_SERVER_ERROR',

      message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu',
    };
  }

  private resolveHttpException(exception: HttpException): ResolvedException {
    const statusCode = exception.getStatus();

    const response = exception.getResponse();

    const statusName = HttpStatus[statusCode];

    let code =
      typeof statusName === 'string' ? statusName : `HTTP_${statusCode}`;

    let message = exception.message || 'Request failed';

    let errors: unknown;

    if (typeof response === 'string') {
      message = response;
    }

    if (this.isExceptionBody(response)) {
      if (typeof response.code === 'string') {
        code = response.code;
      }

      if (typeof response.message === 'string') {
        message = response.message;
      }

      /*
       * Trường hợp ValidationPipe mặc định trả:
       * message: string[]
       */
      if (Array.isArray(response.message)) {
        message = 'Dữ liệu đầu vào không hợp lệ';

        errors = response.message;
      }

      /*
       * Trường hợp ValidationPipe tùy chỉnh
       * trả về errors riêng.
       */
      if (response.errors !== undefined) {
        errors = response.errors;
      }
    }

    return {
      statusCode,
      code,
      message,
      errors,
    };
  }

  private resolveQueryFailedError(
    exception: QueryFailedError,
  ): ResolvedException {
    const driverError = exception.driverError as PostgresDriverError;

    switch (driverError.code) {
      /*
       * unique_violation
       */
      case '23505':
        return {
          statusCode: HttpStatus.CONFLICT,
          code: 'DATABASE_UNIQUE_VIOLATION',
          message: 'Dữ liệu đã tồn tại',
        };

      /*
       * foreign_key_violation
       */
      case '23503':
        return {
          statusCode: HttpStatus.CONFLICT,
          code: 'DATABASE_FOREIGN_KEY_VIOLATION',
          message:
            'Dữ liệu đang được tham chiếu hoặc dữ liệu liên kết không tồn tại',
        };

      /*
       * not_null_violation
       */
      case '23502':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'DATABASE_NOT_NULL_VIOLATION',
          message: 'Thiếu trường dữ liệu bắt buộc',
        };

      /*
       * check_violation
       */
      case '23514':
        return {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          code: 'DATABASE_CHECK_VIOLATION',
          message: 'Dữ liệu không thỏa mãn điều kiện của hệ thống',
        };

      /*
       * invalid_text_representation
       */
      case '22P02':
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          code: 'DATABASE_INVALID_INPUT',
          message: 'Dữ liệu đầu vào không đúng định dạng',
        };

      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'DATABASE_ERROR',
          message: 'Đã xảy ra lỗi khi xử lý dữ liệu',
        };
    }
  }

  private isExceptionBody(value: unknown): value is ExceptionBody {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
