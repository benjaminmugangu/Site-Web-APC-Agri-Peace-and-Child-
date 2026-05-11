import { AppDataSource } from '@/config/database.config';
import { Project, ProjectStatus, ProjectCategory } from '@/entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { NotFoundError, ConflictError } from '@/common/utils/error.util';
import { PaginationUtil } from '@/common/utils/pagination.util';
import { In } from 'typeorm';

export class ProjectService {
  private repository = AppDataSource.getRepository(Project);

  async create(data: CreateProjectDto) {
    const existing = await this.repository.findOneBy({ slug: data.slug });
    if (existing) {
      throw new ConflictError('Un projet avec ce slug existe déjà');
    }

    const project = this.repository.create(data);
    return await this.repository.save(project);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    adminMode?: boolean;
    category?: ProjectCategory;
    status?: ProjectStatus;
    search?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const qb = this.repository.createQueryBuilder('project');

    if (!query.adminMode) {
      qb.where('project.isVisible = :visible', { visible: true });
      qb.andWhere('project.status = :status', { status: ProjectStatus.PUBLISHED });
    } else {
      if (query.status) {
        qb.andWhere('project.status = :status', { status: query.status });
      }
    }

    if (query.category) {
      qb.andWhere('project.category = :category', { category: query.category });
    }

    if (query.search) {
      qb.andWhere('(project.title ILIKE :search OR project.description ILIKE :search)', { 
        search: `%${query.search}%` 
      });
    }

    qb.orderBy('project.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    
    return {
      items,
      meta: PaginationUtil.getMeta(total, page, limit)
    };
  }

  async findOne(id: string) {
    const project = await this.repository.findOneBy({ id });
    if (!project) {
      throw new NotFoundError('Projet introuvable');
    }
    return project;
  }

  async update(id: string, data: UpdateProjectDto) {
    const project = await this.findOne(id);
    
    if (data.slug && data.slug !== project.slug) {
      const existing = await this.repository.findOneBy({ slug: data.slug });
      if (existing) {
        throw new ConflictError('Un projet avec ce slug existe déjà');
      }
    }

    Object.assign(project, data);
    return await this.repository.save(project);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await this.repository.remove(project);
    return true;
  }

  async duplicate(id: string) {
    const original = await this.findOne(id);
    const copy = this.repository.create({
      ...original,
      id: undefined,
      title: `${original.title} (Copie)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: ProjectStatus.DRAFT,
      createdAt: undefined,
      updatedAt: undefined
    });
    return await this.repository.save(copy);
  }

  async setStatus(id: string, status: ProjectStatus) {
    const project = await this.findOne(id);
    project.status = status;
    return await this.repository.save(project);
  }

  async bulkDelete(ids: string[]) {
    await this.repository.delete({ id: In(ids) });
    return true;
  }

  async bulkSetStatus(ids: string[], status: ProjectStatus) {
    await this.repository.update({ id: In(ids) }, { status });
    return true;
  }
}
