import { Request, Response, NextFunction } from 'express';
import { NewsService } from './news.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class NewsController {
  private service = new NewsService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Actualité créée avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const adminMode = (req as any).user?.role === 'ADMIN';
      
      const { items, meta } = await this.service.findAll({
        page,
        limit,
        adminMode,
        category: req.query.category as string,
        status: req.query.status as any,
        featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
        search: req.query.search as string
      });
      return ResponseUtil.success(res, 'Liste des actualités récupérée', items, meta);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails de l\'actualité récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Actualité mise à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Actualité supprimée avec succès');
    } catch (error) {
      next(error);
    }
  };

  duplicate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.duplicate(req.params.id as string);
      return ResponseUtil.success(res, 'Actualité dupliquée avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.setStatus(req.params.id as string, 'published' as any);
      return ResponseUtil.success(res, 'Actualité publiée avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      await this.service.bulkDelete(ids);
      return ResponseUtil.success(res, 'Actualités supprimées avec succès');
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

  setStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.setStatus(req.params.id as string, req.body.status);
      return ResponseUtil.success(res, 'Statut mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };
}
