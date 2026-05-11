import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CareerType {
  JOB = 'JOB',
  TENDER = 'TENDER' // Appel d'offres
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Career:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         type:
 *           type: string
 *           enum: [JOB, TENDER]
 *         description:
 *           type: string
 *         requirements:
 *           type: string
 *         location:
 *           type: string
 *         deadline:
 *           type: string
 *           format: date-time
 *         isOpen:
 *           type: boolean
 *         applicationLink:
 *           type: string
 */
@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({
    type: 'enum',
    enum: CareerType,
    default: CareerType.JOB
  })
  type!: CareerType;

  @Column('text')
  description!: string;

  @Column('text', { nullable: true })
  requirements!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline!: Date;

  @Column({ default: true })
  isOpen!: boolean;

  @Column({ nullable: true })
  applicationLink!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
