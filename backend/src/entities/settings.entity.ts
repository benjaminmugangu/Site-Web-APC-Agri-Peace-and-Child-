import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         hero:
 *           type: object
 *         stats:
 *           type: object
 *         contact:
 *           type: object
 */
@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('json', { nullable: true })
  hero!: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };

  @Column('json', { nullable: true })
  stats!: {
    beneficiaries: string;
    projects: string;
    provinces: string;
  };

  @Column('json', { nullable: true })
  contact!: {
    address: string;
    phone: string;
    email: string;
    socials?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };

  @UpdateDateColumn()
  updatedAt!: Date;
}
