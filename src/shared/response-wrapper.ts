export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;

  constructor(statusCode: number, message: string, data?: T, error?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}