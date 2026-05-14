import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HeroSettingsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

class StatsSettingsDto {
  @IsString()
  @IsOptional()
  beneficiaries?: string;

  @IsString()
  @IsOptional()
  projects?: string;

  @IsString()
  @IsOptional()
  provinces?: string;
}

class ContactSettingsDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsObject()
  @IsOptional()
  socials?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export class UpdateSettingsDto {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => HeroSettingsDto)
  hero?: HeroSettingsDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => StatsSettingsDto)
  stats?: StatsSettingsDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactSettingsDto)
  contact?: ContactSettingsDto;
}
