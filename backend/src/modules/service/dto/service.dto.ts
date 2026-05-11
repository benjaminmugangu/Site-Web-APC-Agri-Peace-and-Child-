import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsArray, IsObject } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  name!: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsString()
  @IsNotEmpty({ message: 'Le slug est requis' })
  slug!: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est requise' })
  description!: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  iconName?: string;

  @IsOptional()
  @IsString()
  bgClass?: string;

  @IsOptional()
  @IsString()
  accentClass?: string;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actions?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  stats?: { value: string; label: string }[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateServiceDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() titleEn?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() descriptionEn?: string;
  @IsOptional() @IsString() iconName?: string;
  @IsOptional() @IsString() bgClass?: string;
  @IsOptional() @IsString() accentClass?: string;
  @IsOptional() @IsString() mainImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) actions?: string[];
  @IsOptional() @IsArray() @IsObject({ each: true }) stats?: { value: string; label: string }[];
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() order?: number;
}
