import { Request, Response, NextFunction } from 'express';
import { ContactService } from './contact.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class ContactController {
  private service = new ContactService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.create(req.body);
      return ResponseUtil.created(res, 'Message envoyé avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.service.findAll({
        page,
        limit,
        status: req.query.status as any,
        type: req.query.type as any,
        search: req.query.search as string
      });
      return ResponseUtil.success(res, 'Liste des messages récupérée', result.items, result.meta);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findOne(req.params.id as string);
      return ResponseUtil.success(res, 'Détails du message récupérés', result);
    } catch (error) {
      next(error);
    }
  };

  setStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const result = await this.service.setStatus(req.params.id as string, status);
      return ResponseUtil.success(res, 'Statut du message mis à jour', result);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.setStatus(req.params.id as string, 'read' as any);
      return ResponseUtil.success(res, 'Message marqué comme lu', result);
    } catch (error) {
      next(error);
    }
  };

  reply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const adminId = (req as any).user.id;
      const result = await this.service.reply(req.params.id as string, content, adminId);
      return ResponseUtil.success(res, 'Réponse envoyée avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.params.id as string);
      return ResponseUtil.success(res, 'Message supprimé avec succès');
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      await this.service.bulkDelete(ids);
      return ResponseUtil.success(res, 'Messages supprimés avec succès');
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await this.service.getUnreadCount();
      return ResponseUtil.success(res, 'Nombre de messages non lus récupéré', { count });
    } catch (error) {
      next(error);
    }
  };
}
