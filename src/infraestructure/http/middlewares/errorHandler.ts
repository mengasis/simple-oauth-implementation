import type { ErrorRequestHandler } from 'express';
import { BaseException } from '../../../domain/exceptions/HttpExceptions';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof BaseException) {
    const response: Record<string, unknown> = {
      error: error.name.replace('Exception', '').toLowerCase(),
      description: error.message,
    };

    if (error.data) {
      response.data = error.data;
    }

    res.status(error.statusCode).json(response);
    return;
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'internal_server_error',
    description: 'An unexpected error occurred'
  });

  return;
}; 