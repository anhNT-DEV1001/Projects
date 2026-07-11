export interface ErrorResponseOptions {
  statusCode: number;
  code: string;
  message: string;
  method: string;
  path: string;
  errors?: unknown;
}

export class ErrorResponse {
  readonly success = false;

  readonly statusCode: number;

  readonly code: string;

  readonly message: string;

  readonly method: string;

  readonly path: string;

  readonly timestamp: string;

  readonly errors?: unknown;

  constructor(options: ErrorResponseOptions) {
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.message = options.message;
    this.method = options.method;
    this.path = options.path;
    this.timestamp = new Date().toISOString();

    if (options.errors !== undefined) {
      this.errors = options.errors;
    }
  }
}
