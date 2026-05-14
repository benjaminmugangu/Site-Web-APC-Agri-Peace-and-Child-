import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '@/config/database.config';
import { TenderSubmission } from '@/entities/tender-submission.entity';
import { ResponseUtil } from '@/common/utils/response.util';

export class SubmissionController {
  private repository = AppDataSource.getRepository(TenderSubmission);

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyName, contactName, email, phone, address, tenderId } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const submission = this.repository.create({
        companyName,
        contactName,
        email,
        phone,
        address,
        tenderId,
        technicalOfferUrl: files?.['offreTechnique']?.[0]?.path,
        financialOfferUrl: files?.['offreFinanciere']?.[0]?.path,
        adminDocUrl: files?.['documentAdministratif']?.[0]?.path,
      });

      const result = await this.repository.save(submission);
      return ResponseUtil.created(res, 'Offre soumise avec succès', result);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.repository.find({
        relations: ['tender'],
        order: { createdAt: 'DESC' }
      });
      return ResponseUtil.success(res, 'Liste des soumissions récupérée', result);
    } catch (error) {
      next(error);
    }
  };
}
