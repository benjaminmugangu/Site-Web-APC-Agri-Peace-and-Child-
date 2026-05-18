import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
 */
@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
