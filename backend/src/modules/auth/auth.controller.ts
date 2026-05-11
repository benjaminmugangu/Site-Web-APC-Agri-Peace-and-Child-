import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class AuthController {
  private authService = new AuthService();

  /**
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Inscrire un nouvel utilisateur
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterDto'
   *     responses:
   *       201:
   *         description: Utilisateur créé avec succès
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      return ResponseUtil.created(res, 'Utilisateur créé avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Connexion utilisateur
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginDto'
   *     responses:
   *       200:
   *         description: Connexion réussie, retourne les tokens
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
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

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      const result = await this.authService.refresh(token);
      return ResponseUtil.success(res, 'Token rafraîchi', result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    // Logique simple pour vider le cookie
    res.clearCookie('refreshToken');
    return ResponseUtil.success(res, 'Déconnexion réussie');
  };
}
