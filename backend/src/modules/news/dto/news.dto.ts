import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { NewsStatus } from '@/entities/news.entity';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le slug est requis' })
  slug!: string;

  @IsString()
  @IsNotEmpty({ message: "L'extrait (excerpt) est requis" })
  excerpt!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le contenu est requis' })
  content!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsNumber()
  readTime?: number;

  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  includeNewsletter?: boolean;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsDateString()
  publishDate?: string;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;
}

export class UpdateNewsDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() author?: string;
  @IsOptional() @IsString() authorId?: string;
  @IsOptional() @IsNumber() readTime?: number;
  @IsOptional() @IsEnum(NewsStatus) status?: NewsStatus;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() includeNewsletter?: boolean;
  @IsOptional() @IsString() mainImage?: string;
  @IsOptional() @IsDateString() publishDate?: string;
  @IsOptional() @IsDateString() scheduledDate?: string;
}
