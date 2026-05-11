import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '@/common/enums/role.enum';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
