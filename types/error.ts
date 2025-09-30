export type AppError = {
  code: string;
  message: string;
  details?: string;
};

export type ErrorType = "validation" | "authentication" | "network" | "unknown";

export type FormError = {
  type: ErrorType;
  message: string;
};
