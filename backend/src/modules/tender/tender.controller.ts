import { Request, Response, NextFunction } from 'express';
import { TenderService } from './tender.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class TenderController {
  private service = new TenderService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Appel d\'offres créé avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const adminMode = (req as any).user?.role === 'ADMIN';

      const result = await this.service.findAll({
        page,
        limit,
        adminMode,
        category: req.query.category as string,
        status: req.query.status as any,
        search: req.query.search as string
      });
      return ResponseUtil.success(res, 'Liste des appels d\'offres récupérée', result.items, result.meta);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails de l\'appel d\'offres récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Appel d\'offres mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Appel d\'offres supprimé avec succès');
    } catch (error) {
      next(error);
    }
  };

  setStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const result = await this.service.setStatus(req.params.id as string, status);
      return ResponseUtil.success(res, 'Statut mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      await this.service.bulkDelete(ids);
      return ResponseUtil.success(res, 'Appels d\'offres supprimés avec succès');
    } catch (error) {
      next(error);
    }
  };

  bulkSetStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, status } = req.body;
      await this.service.bulkSetStatus(ids, status);
      return ResponseUtil.success(res, 'Statuts mis à jour avec succès');
    } catch (error) {
      next(error);
    }
  };
}
