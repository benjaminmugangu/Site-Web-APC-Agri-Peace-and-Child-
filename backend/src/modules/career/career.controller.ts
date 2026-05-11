import { Request, Response, NextFunction } from 'express';
import { CareerService } from './career.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class CareerController {
  private service = new CareerService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Offre créée avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const adminMode = (req as any).user?.role === 'ADMIN';
      
      const { items, meta } = await this.service.findAll(page, limit, adminMode);
      return ResponseUtil.success(res, 'Liste des offres récupérée', items, meta);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails de l\'offre récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Offre mise à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Offre supprimée avec succès');
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      await this.service.bulkDelete(ids);
      return ResponseUtil.success(res, 'Offres supprimées avec succès');
    } catch (error) {
      next(error);
    }
  };

  bulkSetStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, isOpen } = req.body;
      await this.service.bulkSetStatus(ids, isOpen);
      return ResponseUtil.success(res, 'Statuts mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  };
}
