import type { ErrorRequestHandler } from 'express';
import { BaseException } from '../../../domain/exceptions/HttpExceptions';
import { LoggerFactory } from '../../logger/LoggerFactory';

const logger = LoggerFactory.getLogger();

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof BaseException) {
    const response: Record<string, unknown> = {
      error: error.name.replace('Exception', '').toLowerCase(),
      description: error.message,
    };

    if (error.data) {
      response.data = error.data;
    }

    logger.error(error, error.constructor.name);
    res.status(error.statusCode).json(response);
    return;
  }

  logger.error(error, 'UnhandledError');
  res.status(500).json({
    error: 'internal_server_error',
    description: 'An unexpected error occurred',
  });
};
