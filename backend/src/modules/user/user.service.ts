import { AppDataSource } from '@/config/database.config';
import { User } from '@/entities/user.entity';
import { UpdateUserAdminDto } from './dto/user-admin.dto';
import { NotFoundError } from '@/common/utils/error.util';
import { PaginationUtil } from '@/common/utils/pagination.util';

export class UserService {
  private repository = AppDataSource.getRepository(User);

  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return {
      items,
      meta: PaginationUtil.getMeta(total, page, limit)
    };
  }

  async findOne(id: string) {
    const user = await this.repository.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }
    return user;
  }

  async update(id: string, data: UpdateUserAdminDto) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }
    
    Object.assign(user, data);
    return await this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }
    await this.repository.remove(user);
    return true;
  }
}
