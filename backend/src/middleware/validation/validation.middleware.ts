import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '@/common/utils/response.util';

export const validationMiddleware = (type: any, value: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const input = plainToInstance(type, req[value]);
    validate(input, { whitelist: true, forbidNonWhitelisted: true }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorMessages = errors.map((error: ValidationError) => ({
          property: error.property,
          constraints: Object.values(error.constraints || {})
        }));
        return ResponseUtil.badRequest(res, 'Erreur de validation', errorMessages);
      } else {
        req[value] = input;
        next();
      }
    });
  };
};
