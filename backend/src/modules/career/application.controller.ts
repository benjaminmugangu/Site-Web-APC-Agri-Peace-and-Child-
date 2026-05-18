import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from './application.service';
import { ResponseUtil } from '@/common/utils/response.util';
import { ApplicationStatus } from '@/entities/application.entity';

export class ApplicationController {
  private service = new ApplicationService();

  apply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cvUrl = req.file ? (req.file as any).path : null;
      const result = await this.service.apply(req.body, cvUrl);
      return ResponseUtil.created(res, 'Candidature soumise avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAll();
      return ResponseUtil.success(res, 'Liste des candidatures récupérée', result);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails de la candidature récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const result = await this.service.updateStatus(req.params.id as string, status as ApplicationStatus);
      return ResponseUtil.success(res, 'Statut de la candidature mis à jour', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Candidature supprimée avec succès');
    } catch (error) {
      next(error);
    }
  };
}
