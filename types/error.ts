// API Error Response
export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// Custom Error Class for API
export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(
    code: string,
    message: string,
    statusCode = 500,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
