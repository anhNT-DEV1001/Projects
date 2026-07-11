import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

import {
  RESPONSE_MESSAGE_KEY,
  SKIP_RESPONSE_TRANSFORM_KEY,
} from '../decorators';

import { SuccessResponse } from '../responses';

interface HttpRequest {
  url: string;
  originalUrl?: string;
}

interface HttpResponse {
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor<unknown, unknown> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skipTransform = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipTransform) {
      return next.handle();
    }

    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<HttpRequest>();

    const response = httpContext.getResponse<HttpResponse>();

    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'Request successful';

    return next.handle().pipe(
      map((data: unknown) => {
        /*
         * Không bọc response download file.
         */
        if (data instanceof StreamableFile) {
          return data;
        }

        /*
         * Tránh bọc SuccessResponse hai lần.
         */
        if (data instanceof SuccessResponse) {
          return data;
        }

        /*
         * HTTP 204 không được phép có response body.
         */
        if (Number(response.statusCode) === Number(HttpStatus.NO_CONTENT)) {
          return undefined;
        }

        return new SuccessResponse({
          statusCode: response.statusCode,
          message,
          data: data ?? null,
          path: request.originalUrl ?? request.url,
        });
      }),
    );
  }
}
