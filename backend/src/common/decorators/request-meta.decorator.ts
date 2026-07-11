import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface RequestMetaDto {
  ip: string;
  userAgent: string;
}

export const RequestMeta = createParamDecorator(
  (_data: undefined, context: ExecutionContext): RequestMetaDto => {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      ip?: string;
    }>();

    const forwardedFor = request.headers['x-forwarded-for'];
    const ipSource = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor || request.ip || '';
    const ip = String(ipSource).split(',')[0].trim().slice(0, 20);
    const userAgent = String(request.headers['user-agent'] || 'unknown').slice(
      0,
      255,
    );

    return {
      ip: ip || 'unknown',
      userAgent,
    };
  },
);
