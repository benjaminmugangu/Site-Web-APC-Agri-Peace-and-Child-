import { In } from 'typeorm';
import { AppDataSource } from '@/config/database.config';
import { Career } from '@/entities/career.entity';
import { CreateCareerDto, UpdateCareerDto } from './dto/career.dto';
import { NotFoundError } from '@/common/utils/error.util';
import { PaginationUtil } from '@/common/utils/pagination.util';

export class CareerService {
  private repository = AppDataSource.getRepository(Career);

  async create(data: CreateCareerDto) {
    const career = this.repository.create(data);
    return await this.repository.save(career);
  }

  async findAll(page: number = 1, limit: number = 10, adminMode: boolean = false) {
    const query = this.repository.createQueryBuilder('career');

    if (!adminMode) {
      query.where('career.isOpen = :open', { open: true });
    }

    query.orderBy('career.createdAt', 'DESC')
         .skip((page - 1) * limit)
         .take(limit);

    const [items, total] = await query.getManyAndCount();
    
    return {
      items,
      meta: PaginationUtil.getMeta(total, page, limit)
    };
  }

  async findOne(id: string) {
    const career = await this.repository.findOneBy({ id });
    if (!career) {
      throw new NotFoundError('Offre/Appel d\'offre introuvable');
    }
    return career;
  }

  async update(id: string, data: UpdateCareerDto) {
    const career = await this.findOne(id);
    Object.assign(career, data);
    return await this.repository.save(career);
  }

  async remove(id: string) {
    const career = await this.findOne(id);
    await this.repository.remove(career);
    return true;
  }

  async bulkDelete(ids: string[]) {
    await this.repository.delete({ id: In(ids) });
    return true;
  }

  async bulkSetStatus(ids: string[], isOpen: boolean) {
    await this.repository.update({ id: In(ids) }, { isOpen });
    return true;
  }
}
