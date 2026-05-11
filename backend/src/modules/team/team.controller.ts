import { Request, Response, NextFunction } from 'express';
import { TeamService } from './team.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class TeamController {
  private service = new TeamService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Membre ajouté avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adminMode = (req as any).user?.role === 'ADMIN';
      const result = await this.service.findAll({
        adminMode,
        department: req.query.department as string,
        status: req.query.status as any,
        search: req.query.search as string
      });
      return ResponseUtil.success(res, 'Liste de l\'équipe récupérée', result);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails du membre récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.update(req.params.id as string, req.body);
      return ResponseUtil.success(res, 'Membre mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Membre supprimé avec succès');
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
      return ResponseUtil.success(res, 'Membres supprimés avec succès');
    } catch (error) {
      next(error);
    }
  };
}
