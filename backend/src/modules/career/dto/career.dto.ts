import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { CareerType } from '@/entities/career.entity';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre est requis' })
  title!: string;

  @IsEnum(CareerType)
  @IsNotEmpty({ message: 'Le type (JOB/TENDER) est requis' })
  type!: CareerType;

  @IsString()
  @IsNotEmpty({ message: 'La description est requise' })
  description!: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsString()
  applicationLink?: string;
}

export class UpdateCareerDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(CareerType) type?: CareerType;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() requirements?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsDateString() deadline?: string;
  @IsOptional() @IsBoolean() isOpen?: boolean;
  @IsOptional() @IsString() applicationLink?: string;
}
