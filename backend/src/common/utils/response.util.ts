import { Response } from 'express';

export class ResponseUtil {
  static success(res: Response, message: string, data: any = null, meta: any = null, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, errors: any[] = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }

  // Helpers pour les cas courants
  static created(res: Response, message: string, data: any = null) {
    return this.success(res, message, data, null, 201);
  }

  static unauthorized(res: Response, message: string = 'Non autorisé') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Accès interdit') {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Ressource non trouvée') {
    return this.error(res, message, 404);
  }

  static badRequest(res: Response, message: string, errors: any[] = []) {
    return this.error(res, message, 400, errors);
  }
}
