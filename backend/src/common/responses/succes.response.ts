import { ApiProperty } from '@nestjs/swagger';

export interface SuccessResponseOptions<T> {
  statusCode: number;
  message: string;
  data: T | null;
  path: string;
}

export class SuccessResponse<T> {
  @ApiProperty({
    example: true,
  })
  readonly success = true;

  @ApiProperty({
    example: 200,
  })
  readonly statusCode: number;

  @ApiProperty({
    example: 'Request successful',
  })
  readonly message: string;

  @ApiProperty({
    nullable: true,
    description: 'Payload của API, được override theo từng endpoint',
  })
  readonly data: T | null;

  @ApiProperty({
    example: '2026-07-12T10:00:00.000Z',
  })
  readonly timestamp: string;

  @ApiProperty({
    example: '/api/v1/auth/me',
  })
  readonly path: string;

  constructor(options: SuccessResponseOptions<T>) {
    this.statusCode = options.statusCode;
    this.message = options.message;
    this.data = options.data;
    this.path = options.path;
    this.timestamp = new Date().toISOString();
  }
}
