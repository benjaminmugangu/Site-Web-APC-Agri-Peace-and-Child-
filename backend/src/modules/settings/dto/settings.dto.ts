import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HeroSettingsDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  subtitle!: string;

  @IsString()
  @IsNotEmpty()
  imageUrl!: string;
}

class StatsSettingsDto {
  @IsString()
  @IsNotEmpty()
  beneficiaries!: string;

  @IsString()
  @IsNotEmpty()
  projects!: string;

  @IsString()
  @IsNotEmpty()
  provinces!: string;
}

class ContactSettingsDto {
  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

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
