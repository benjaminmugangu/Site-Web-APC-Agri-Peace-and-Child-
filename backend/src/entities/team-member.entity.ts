import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MemberStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum MemberAccess {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamMember:
 *       type: object
 *       required:
 *         - name
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         role:
 *           type: string
 *         department:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         access:
 *           type: string
 *           enum: [super_admin, admin, editor, viewer]
 *         status:
 *           type: string
 *           enum: [active, suspended, pending]
 *         photoUrl:
 *           type: string
 *         bio:
 *           type: string
 */
@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  role!: string; // Poste / Rôle

  @Column({ default: 'Programmes' })
  department!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({
    type: 'enum',
    enum: MemberAccess,
    default: MemberAccess.EDITOR
  })
  access!: MemberAccess;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.ACTIVE
  })
  status!: MemberStatus;

  @Column({ type: 'date', nullable: true })
  joinDate!: Date;

  @Column({ nullable: true })
  avatarInitials!: string;

  @Column({ default: 'bg-emerald-600' })
  avatarColor!: string;

  @Column('text', { nullable: true })
  bio!: string;

  @Column({ nullable: true })
  photoUrl!: string;

  @Column({ nullable: true })
  linkedinUrl!: string;

  @Column({ default: 0 })
  order!: number;

  @Column({ default: 0 })
  activityCount!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
