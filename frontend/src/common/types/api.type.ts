export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  method: string;
  path: string;
  timestamp: string;
  errors?: unknown;
}