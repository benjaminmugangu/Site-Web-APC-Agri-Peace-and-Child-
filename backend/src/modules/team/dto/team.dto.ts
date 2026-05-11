import { IsString, IsNotEmpty, IsOptional, IsUrl, IsBoolean, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { MemberStatus, MemberAccess } from '@/entities/team-member.entity';

export class CreateTeamMemberDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le rôle est requis' })
  role!: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(MemberAccess)
  access?: MemberAccess;

  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @IsOptional()
  @IsString()
  avatarInitials?: string;

  @IsOptional()
  @IsString()
  avatarColor?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL LinkedIn invalide' })
  linkedinUrl?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsNumber()
  activityCount?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateTeamMemberDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEnum(MemberAccess) access?: MemberAccess;
  @IsOptional() @IsEnum(MemberStatus) status?: MemberStatus;
  @IsOptional() @IsDateString() joinDate?: string;
  @IsOptional() @IsString() avatarInitials?: string;
  @IsOptional() @IsString() avatarColor?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsUrl() linkedinUrl?: string;
  @IsOptional() @IsNumber() order?: number;
  @IsOptional() @IsNumber() activityCount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
