import { AppDataSource } from '@/config/database.config';
import { News, NewsStatus } from '@/entities/news.entity';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';
import { NotFoundError, ConflictError } from '@/common/utils/error.util';
import { PaginationUtil } from '@/common/utils/pagination.util';
import { In, LessThanOrEqual } from 'typeorm';

export class NewsService {
  private repository = AppDataSource.getRepository(News);

  async create(data: CreateNewsDto) {
    const existing = await this.repository.findOneBy({ slug: data.slug });
    if (existing) {
      throw new ConflictError('Une actualité avec ce slug existe déjà');
    }

    const news = this.repository.create({
      ...data,
      publishDate: data.status === NewsStatus.PUBLISHED ? new Date() : data.publishDate
    });
    return await this.repository.save(news);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    adminMode?: boolean;
    category?: string;
    status?: NewsStatus;
    featured?: boolean;
    search?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const qb = this.repository.createQueryBuilder('news');

    if (!query.adminMode) {
      qb.where('news.status = :status', { status: NewsStatus.PUBLISHED });
      qb.andWhere('(news.publishDate <= :now OR news.publishDate IS NULL)', { now: new Date() });
    } else {
      if (query.status) {
        qb.andWhere('news.status = :status', { status: query.status });
      }
    }

    if (query.category) {
      qb.andWhere('news.category = :category', { category: query.category });
    }

    if (query.featured !== undefined) {
      qb.andWhere('news.featured = :featured', { featured: query.featured });
    }

    if (query.search) {
      qb.andWhere('(news.title ILIKE :search OR news.content ILIKE :search)', { 
        search: `%${query.search}%` 
      });
    }

    qb.orderBy('news.publishDate', 'DESC')
      .addOrderBy('news.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    
    return {
      items,
      meta: PaginationUtil.getMeta(total, page, limit)
    };
  }

  async findOne(id: string) {
    const news = await this.repository.findOneBy({ id });
    if (!news) {
      throw new NotFoundError('Actualité introuvable');
    }
    return news;
  }

  async findBySlug(slug: string) {
    const news = await this.repository.findOne({
      where: {
        slug,
        status: NewsStatus.PUBLISHED,
        publishDate: LessThanOrEqual(new Date())
      }
    });

    if (!news) {
      throw new NotFoundError('Actualité introuvable');
    }
    return news;
  }

  async update(id: string, data: UpdateNewsDto) {
    const news = await this.findOne(id);
    
    if (data.slug && data.slug !== news.slug) {
      const existing = await this.repository.findOneBy({ slug: data.slug });
      if (existing) {
        throw new ConflictError('Une actualité avec ce slug existe déjà');
      }
    }

    // Gérer la date de publication automatique
    if (data.status === NewsStatus.PUBLISHED && news.status !== NewsStatus.PUBLISHED) {
      news.publishDate = new Date();
    }

    Object.assign(news, data);
    return await this.repository.save(news);
  }

  async remove(id: string) {
    const news = await this.findOne(id);
    await this.repository.remove(news);
    return true;
  }

  async duplicate(id: string) {
    const original = await this.findOne(id);
    const copy = this.repository.create({
      ...original,
      id: undefined,
      title: `${original.title} (Copie)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: NewsStatus.DRAFT,
      publishDate: null,
      scheduledDate: null,
      createdAt: undefined,
      updatedAt: undefined
    });
    return await this.repository.save(copy);
  }

  async setStatus(id: string, status: NewsStatus) {
    const news = await this.findOne(id);
    news.status = status;
    if (status === NewsStatus.PUBLISHED) {
      news.publishDate = new Date();
    }
    return await this.repository.save(news);
  }

  async bulkDelete(ids: string[]) {
    await this.repository.delete({ id: In(ids) });
    return true;
  }

  async bulkSetStatus(ids: string[], status: NewsStatus) {
    const updateData: any = { status };
    if (status === NewsStatus.PUBLISHED) {
      updateData.publishDate = new Date();
    }
    await this.repository.update({ id: In(ids) }, updateData);
    return true;
  }
}
