import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, IsBoolean, IsDateString, IsNumber } from 'class-validator';
import { ProjectStatus, ProjectCategory } from '@/entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le slug est requis' })
  slug!: string;

  @IsString()
  @IsNotEmpty({ message: 'La description est requise' })
  description!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsEnum(ProjectCategory)
  @IsNotEmpty({ message: 'La catégorie est requise' })
  category!: ProjectCategory;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsNumber()
  beneficiaries?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  showOnHome?: boolean;

  @IsOptional()
  @IsBoolean()
  needsDonation?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class UpdateProjectDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsEnum(ProjectCategory) category?: ProjectCategory;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
  @IsOptional() @IsNumber() budget?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() province?: string;
  @IsOptional() @IsNumber() beneficiaries?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsString() mainImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() showOnHome?: boolean;
  @IsOptional() @IsBoolean() needsDonation?: boolean;
  @IsOptional() @IsBoolean() isVisible?: boolean;
}
