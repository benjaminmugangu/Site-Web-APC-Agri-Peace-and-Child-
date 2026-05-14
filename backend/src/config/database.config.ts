import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Message } from '../entities/message.entity';
import { News } from '../entities/news.entity';
import { Project } from '../entities/project.entity';
import { Service } from '../entities/service.entity';
import { Partner } from '../entities/partner.entity';
import { TeamMember } from '../entities/team-member.entity';
import { Tender } from '../entities/tender.entity';
import { Career } from '../entities/career.entity';
import { Settings } from '../entities/settings.entity';
import { Application } from '../entities/application.entity';
import { TenderSubmission } from '../entities/tender-submission.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Priorité à l'URL complète si elle existe (Railway/Heroku)
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'apc_db',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: process.env.NODE_ENV === 'development' || process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Message, News, Project, Service, Partner, TeamMember, Tender, Career, Settings, Application, TenderSubmission],
  migrations: [],
  subscribers: [],
});

