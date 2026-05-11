import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsUUID, IsArray } from 'class-validator';
import { TenderStatus } from '@/entities/tender.entity';

export class CreateTenderDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsEnum(TenderStatus)
  @IsOptional()
  status?: TenderStatus;

  @IsDateString()
  @IsNotEmpty()
  deadline!: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  organization?: string;
}

export class UpdateTenderDto extends CreateTenderDto {}

export class BulkDeleteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];
}
