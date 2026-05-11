import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '@/common/utils/response.util';
import { AppError } from '@/common/utils/error.util';

export class MediaController {
  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError("Aucun fichier n'a été téléchargé", 400);
      }

      const fileData = {
        url: (req.file as any).path,
        publicId: (req.file as any).filename,
        originalName: req.file.originalname,
        size: req.file.size
      };

      return ResponseUtil.success(res, 'Image téléchargée avec succès', fileData);
    } catch (error) {
      next(error);
    }
  };
}
