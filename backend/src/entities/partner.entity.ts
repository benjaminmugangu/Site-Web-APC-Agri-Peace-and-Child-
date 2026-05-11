import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PartnerType {
  DONOR = 'DONOR',     // Bailleur
  TECHNICAL = 'TECHNICAL', // Partenaire technique
  LOCAL = 'LOCAL'      // Partenaire local
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [DONOR, TECHNICAL, LOCAL]
 *         logoUrl:
 *           type: string
 *         websiteUrl:
 *           type: string
 *         description:
 *           type: string
 *         contactName:
 *           type: string
 *         contactEmail:
 *           type: string
 *         isActive:
 *           type: boolean
 */
@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: PartnerType,
    default: PartnerType.LOCAL
  })
  type!: PartnerType;

  @Column({ nullable: true })
  logoUrl!: string;

  @Column({ nullable: true })
  websiteUrl!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ nullable: true })
  contactName!: string;

  @Column({ nullable: true })
  contactEmail!: string;

  @Column({ nullable: true })
  contactPhone!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalFunding!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
