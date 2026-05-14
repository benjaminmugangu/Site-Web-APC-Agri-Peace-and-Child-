import { Request, Response, NextFunction } from 'express';
import { ProjectService } from './project.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class ProjectController {
  private service = new ProjectService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Projet créé avec succès', result);
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
        category: req.query.category as any,
        status: req.query.status as any,
        search: req.query.search as string
      });
      return ResponseUtil.success(res, 'Liste des projets récupérée', items, meta);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails du projet récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  findBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findBySlug(req.params.slug as string);
      return ResponseUtil.success(res, 'Détails du projet récupérés par slug', result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Projet mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Projet supprimé avec succès');
    } catch (error) {
      next(error);
    }
  };

  duplicate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.duplicate(req.params.id as string);
      return ResponseUtil.success(res, 'Projet dupliqué avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  publish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.setStatus(req.params.id as string, 'published' as any);
      return ResponseUtil.success(res, 'Projet publié avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  unpublish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.setStatus(req.params.id as string, 'draft' as any);
      return ResponseUtil.success(res, 'Projet dépublié avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  archive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.setStatus(req.params.id as string, 'archived' as any);
      return ResponseUtil.success(res, 'Projet archivé avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      await this.service.bulkDelete(ids);
      return ResponseUtil.success(res, 'Projets supprimés avec succès');
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
