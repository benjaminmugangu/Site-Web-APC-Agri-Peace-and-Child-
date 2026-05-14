import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class UserController {
  private service = new UserService();

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { items, meta } = await this.service.findAll(page, limit);
      return ResponseUtil.success(res, 'Liste des utilisateurs récupérée', items, meta);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails de l\'utilisateur récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.success(res, 'Utilisateur créé avec succès', result, undefined, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Utilisateur mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Utilisateur supprimé avec succès');
    } catch (error) {
      next(error);
    }
  };
}
