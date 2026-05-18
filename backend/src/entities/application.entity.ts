import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Career } from './career.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({
    type: 'enum',
    enum: ['volunteer', 'internship', 'job', 'consultant'],
    default: 'job'
  })
  type!: string;

  @Column('text', { nullable: true })
  motivation!: string;

  @Column({ type: 'varchar', nullable: true })
  cvUrl!: string | null;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status!: ApplicationStatus;

  @ManyToOne(() => Career, { nullable: true, onDelete: 'SET NULL' })
  career!: Career;

  @Column({ nullable: true })
  careerId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
