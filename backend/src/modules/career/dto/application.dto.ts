import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  type!: string; // volunteer, internship, job, consultant

  @IsString()
  @IsOptional()
  motivation?: string;

  @IsUUID()
  @IsOptional()
  careerId?: string;
}
