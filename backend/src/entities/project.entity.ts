import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProjectCategory {
  AGRICULTURE = 'agriculture',
  PROTECTION = 'protection',
  DIGNITE = 'dignite',
  PAIX = 'paix'
}

export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         content:
 *           type: string
 *         category:
 *           type: string
 *           enum: [agriculture, protection, dignite, paix]
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *         budget:
 *           type: number
 *         location:
 *           type: string
 *         beneficiaries:
 *           type: number
 *         mainImage:
 *           type: string
 *         isVisible:
 *           type: boolean
 */
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column('text')
  description!: string;

  @Column('text', { nullable: true })
  content!: string;

  @Column({
    type: 'enum',
    enum: ProjectCategory,
    default: ProjectCategory.AGRICULTURE
  })
  category!: ProjectCategory;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT
  })
  status!: ProjectStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  budget!: number;

  @Column({ default: 'USD' })
  currency!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  province!: string;

  @Column({ default: 0 })
  beneficiaries!: number;

  @Column({ type: 'date', nullable: true })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date;

  @Column({ nullable: true })
  mainImage!: string;

  @Column('simple-array', { nullable: true })
  gallery!: string[];

  @Column({ default: false })
  featured!: boolean;

  @Column({ default: true })
  showOnHome!: boolean;

  @Column({ default: false })
  needsDonation!: boolean;

  @Column({ default: true })
  isVisible!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
