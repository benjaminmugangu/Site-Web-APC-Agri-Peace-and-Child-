import { AppDataSource } from '@/config/database.config';
import { Service } from '@/entities/service.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { NotFoundError, ConflictError } from '@/common/utils/error.util';
import { In } from 'typeorm';

export class ServiceService {
  private repository = AppDataSource.getRepository(Service);

  async create(data: CreateServiceDto) {
    const existing = await this.repository.findOneBy({ slug: data.slug });
    if (existing) {
      throw new ConflictError('Un service avec ce slug existe déjà');
    }

    const service = this.repository.create(data);
    return await this.repository.save(service);
  }

  async findAll(query: {
    adminMode?: boolean;
    search?: string;
  }) {
    const qb = this.repository.createQueryBuilder('service');

    if (!query.adminMode) {
      qb.where('service.isActive = :active', { active: true });
    }

    if (query.search) {
      qb.andWhere('(service.name ILIKE :search OR service.description ILIKE :search)', { 
        search: `%${query.search}%` 
      });
    }

    qb.orderBy('service.order', 'ASC')
      .addOrderBy('service.createdAt', 'ASC');

    return await qb.getMany();
  }

  async findOne(id: string) {
    const service = await this.repository.findOneBy({ id });
    if (!service) {
      throw new NotFoundError('Service introuvable');
    }
    return service;
  }

  async update(id: string, data: UpdateServiceDto) {
    const service = await this.findOne(id);
    
    if (data.slug && data.slug !== service.slug) {
      const existing = await this.repository.findOneBy({ slug: data.slug });
      if (existing) {
        throw new ConflictError('Un service avec ce slug existe déjà');
      }
    }

    Object.assign(service, data);
    return await this.repository.save(service);
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    await this.repository.remove(service);
    return true;
  }

  async bulkDelete(ids: string[]) {
    await this.repository.delete({ id: In(ids) });
    return true;
  }
}
