import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived'
}

export enum MessageType {
  CONTACT = 'contact',
  PARTNERSHIP = 'partnership',
  DONATION = 'donation',
  OTHER = 'other'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - email
 *         - subject
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         sender:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         subject:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: string
 *           enum: [contact, partnership, donation, other]
 *         status:
 *           type: string
 *           enum: [unread, read, replied, archived]
 */
@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sender!: string; // Nom de l'expéditeur

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column()
  subject!: string;

  @Column('text')
  content!: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.CONTACT
  })
  type!: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.UNREAD
  })
  status!: MessageStatus;

  @Column({ nullable: true })
  repliedAt!: Date;

  @Column({ nullable: true })
  repliedBy!: string; // ID de l'admin ayant répondu

  @Column('text', { nullable: true })
  replyContent!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
