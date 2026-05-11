import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl, IsBoolean, IsNumber } from 'class-validator';
import { PartnerType } from '@/entities/partner.entity';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  name!: string;

  @IsEnum(PartnerType)
  @IsNotEmpty({ message: 'Le type est requis' })
  type!: PartnerType;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL du site web invalide' })
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsNumber()
  totalFunding?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePartnerDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(PartnerType) type?: PartnerType;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsUrl() websiteUrl?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsString() contactEmail?: string;
  @IsOptional() @IsString() contactPhone?: string;
  @IsOptional() @IsNumber() totalFunding?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
