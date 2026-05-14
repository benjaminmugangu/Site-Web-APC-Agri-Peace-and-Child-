import { AppDataSource } from '@/config/database.config';
import { Message, MessageStatus, MessageType } from '@/entities/message.entity';
import { CreateMessageDto } from './dto/contact.dto';
import { NotFoundError } from '@/common/utils/error.util';
import { In } from 'typeorm';

export class ContactService {
  private repository = AppDataSource.getRepository(Message);

  async create(data: CreateMessageDto) {
    const message = this.repository.create(data);
    return await this.repository.save(message);
  }

  async findAll(query: {
    status?: MessageStatus;
    type?: MessageType;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, type, search, page = 1, limit = 20 } = query;
    const qb = this.repository.createQueryBuilder('message');

    if (status) {
      qb.andWhere('message.status = :status', { status });
    }

    if (type) {
      qb.andWhere('message.type = :type', { type });
    }

    if (search) {
      qb.andWhere('(message.sender ILIKE :search OR message.subject ILIKE :search OR message.email ILIKE :search)', { 
        search: `%${search}%` 
      });
    }

    qb.orderBy('message.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const message = await this.repository.findOneBy({ id });
    if (!message) {
      throw new NotFoundError('Message introuvable');
    }
    return message;
  }

  async setStatus(id: string, status: MessageStatus) {
    const message = await this.findOne(id);
    message.status = status;
    return await this.repository.save(message);
  }

  async markAsReplied(id: string, adminId: string) {
    const message = await this.findOne(id);
    message.status = MessageStatus.REPLIED;
    message.repliedAt = new Date();
    message.repliedBy = adminId;
    return await this.repository.save(message);
  }

  async reply(id: string, content: string, adminId: string) {
    const message = await this.findOne(id);
    
    // Ici on simulerait l'envoi d'un email réel via un service comme Nodemailer
    // Pour l'instant on met à jour le statut et on stocke la réponse
    message.status = MessageStatus.REPLIED;
    message.repliedAt = new Date();
    message.repliedBy = adminId;
    message.replyContent = content; // On suppose que ce champ existe ou on l'ajoute à l'entité
    
    return await this.repository.save(message);
  }

  async remove(id: string) {
    const message = await this.findOne(id);
    await this.repository.remove(message);
    return true;
  }

  async bulkDelete(ids: string[]) {
    await this.repository.delete({ id: In(ids) });
    return true;
  }

  async getUnreadCount() {
    return await this.repository.countBy({ status: MessageStatus.UNREAD });
  }
}
