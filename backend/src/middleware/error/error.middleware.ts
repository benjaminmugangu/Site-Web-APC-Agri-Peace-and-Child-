import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/common/utils/error.util';
import { logger } from '@/config/logger.config';
import { ResponseUtil } from '@/common/utils/response.util';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log de l'erreur
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (err.statusCode === 500) {
    logger.error(err.stack);
  }

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // En production, ne pas exposer les détails des erreurs 500
  if (err.isOperational) {
    return ResponseUtil.error(res, err.message, err.statusCode);
  }

  return ResponseUtil.error(res, 'Une erreur interne est survenue', 500);
};
