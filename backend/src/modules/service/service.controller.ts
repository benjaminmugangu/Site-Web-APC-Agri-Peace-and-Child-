import { Request, Response, NextFunction } from 'express';
import { ServiceService } from './service.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class ServiceController {
  private service = new ServiceService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Service créé avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminMode = (req as any).user?.role === 'ADMIN';
      const result = await this.service.findAll({
        adminMode,
        search: req.query.search as string
      });
      return ResponseUtil.success(res, 'Liste des services récupérée', result);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails du service récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Service mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Service supprimé avec succès');
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      await this.service.bulkDelete(ids);
      return ResponseUtil.success(res, 'Services supprimés avec succès');
    } catch (error) {
      next(error);
    }
  };
}
