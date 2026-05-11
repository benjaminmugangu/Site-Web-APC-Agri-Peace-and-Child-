import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { ResponseUtil } from '@/common/utils/response.util';

export class SettingsController {
  private service = new SettingsService();

  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getSettings();
      return ResponseUtil.success(res, 'Paramètres récupérés avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.updateSettings(req.body);
      return ResponseUtil.success(res, 'Paramètres mis à jour avec succès', result);
    } catch (error) {
      next(error);
    }
  };
}
