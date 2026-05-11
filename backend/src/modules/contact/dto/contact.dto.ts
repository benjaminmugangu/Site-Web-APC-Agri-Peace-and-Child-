import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsArray, IsUUID } from 'class-validator';
import { MessageStatus, MessageType } from '@/entities/message.entity';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  sender!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;
}

export class UpdateMessageStatusDto {
  @IsEnum(MessageStatus)
  @IsNotEmpty()
  status!: MessageStatus;
}

export class BulkDeleteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];
}
