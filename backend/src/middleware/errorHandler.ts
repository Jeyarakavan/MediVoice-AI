import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode = 500): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Never leak stack traces or internal errors in production
  const message =
    isProduction && statusCode === 500
      ? 'An unexpected error occurred'
      : err.message || 'An unexpected error occurred';

  // Log safely (avoid logging request body which may contain sensitive data)
  if (statusCode >= 500) {
    console.error(`[Error] ${req.method} ${req.path} — ${err.message}`);
    if (!isProduction) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
}
