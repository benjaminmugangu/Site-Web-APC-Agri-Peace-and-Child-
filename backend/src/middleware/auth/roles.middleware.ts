import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ResponseUtil } from '@/common/utils/response.util';
import { UserRole } from '@/common/enums/role.enum';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseUtil.unauthorized(res);
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return ResponseUtil.forbidden(res, "Vous n'avez pas les permissions nécessaires pour cette action");
    }

    next();
  };
};
