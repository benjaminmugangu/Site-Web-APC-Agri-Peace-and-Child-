import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config/jwt.config';
import { ResponseUtil } from '@/common/utils/response.util';
import { UnauthorizedError } from '@/common/utils/error.util';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseUtil.unauthorized(res, 'Token manquant ou format invalide');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.accessSecret) as any;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    return ResponseUtil.unauthorized(res, 'Token invalide ou expiré');
  }
};
