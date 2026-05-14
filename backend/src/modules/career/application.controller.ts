import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@/config/database.config';
import { Application } from '@/entities/application.entity';
import { ResponseUtil } from '@/common/utils/response.util';

export class ApplicationController {
  private repository = AppDataSource.getRepository(Application);

  apply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, phone, type, motivation, careerId } = req.body;
      const cvUrl = req.file ? (req.file as any).path : null;

      const application = this.repository.create({
        firstName,
        lastName,
        email,
        phone,
        type,
        motivation,
        careerId,
        cvUrl
      });

      const result = await this.repository.save(application);
      return ResponseUtil.created(res, 'Candidature soumise avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.repository.find({
        relations: ['career'],
        order: { createdAt: 'DESC' }
      });
      return ResponseUtil.success(res, 'Liste des candidatures récupérée', result);
    } catch (error) {
      next(error);
    }
  };
}
