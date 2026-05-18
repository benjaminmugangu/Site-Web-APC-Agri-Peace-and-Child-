import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/middleware/auth/auth.middleware';
import { AuthService } from './auth.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class AuthController {
  private authService = new AuthService();


  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      
      // Optionnel : Envoyer le refresh token dans un cookie HttpOnly comme suggéré dans la doc
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });

      return ResponseUtil.success(res, 'Connexion réussie', result);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.body?.refreshToken || req.cookies?.refreshToken;
      const result = await this.authService.refresh(token);
      return ResponseUtil.success(res, 'Token rafraîchi', result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (userId) {
        await this.authService.logout(userId);
      }
      res.clearCookie('refreshToken');
      return ResponseUtil.success(res, 'Déconnexion réussie');
    } catch (error) {
      next(error);
    }
  };
}
