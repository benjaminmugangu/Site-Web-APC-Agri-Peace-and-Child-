import { AppDataSource } from '@/config/database.config';
import { Partner, PartnerType } from '@/entities/partner.entity';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';
import { NotFoundError } from '@/common/utils/error.util';
import { In } from 'typeorm';

export class PartnerService {
  private repository = AppDataSource.getRepository(Partner);

  async create(data: CreatePartnerDto) {
    const partner = this.repository.create(data);
    return await this.repository.save(partner);
  }

  async findAll(query: {
    adminMode?: boolean;
    type?: PartnerType;
    search?: string;
  }) {
    const qb = this.repository.createQueryBuilder('partner');

    if (!query.adminMode) {
      qb.where('partner.isActive = :active', { active: true });
    }

    if (query.type) {
      qb.andWhere('partner.type = :type', { type: query.type });
    }

    if (query.search) {
      qb.andWhere('(partner.name ILIKE :search OR partner.description ILIKE :search)', { 
        search: `%${query.search}%` 
      });
    }

    qb.orderBy('partner.name', 'ASC');

    return await qb.getMany();
  }

  async findOne(id: string) {
    const partner = await this.repository.findOneBy({ id });
    if (!partner) {
      throw new NotFoundError('Partenaire introuvable');
    }
    return partner;
  }

  async update(id: string, data: UpdatePartnerDto) {
    const partner = await this.findOne(id);
    Object.assign(partner, data);
    return await this.repository.save(partner);
  }

  async remove(id: string) {
    const partner = await this.findOne(id);
    await this.repository.remove(partner);
    return true;
  }

  async bulkDelete(ids: string[]) {
    await this.repository.delete({ id: In(ids) });
    return true;
  }
}
