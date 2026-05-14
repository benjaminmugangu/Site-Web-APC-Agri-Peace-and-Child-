import bcrypt from 'bcryptjs';
import { AppDataSource } from '@/config/database.config';
import { User } from '@/entities/user.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { BadRequestError, UnauthorizedError } from '@/common/utils/error.util';
import { TokenUtil } from '@/common/utils/token.util';
import { UserRole } from '@/common/enums/role.enum';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(data: RegisterDto) {
    const existingUser = await this.userRepository.findOneBy({ email: data.email });
    if (existingUser) {
      throw new BadRequestError('Cet email est déjà utilisé');
    }

    const userCount = await this.userRepository.count();
    
    const user = this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: userCount === 0 ? UserRole.ADMIN : UserRole.VISITOR
    });

    await this.userRepository.save(user);
    
    // On ne renvoie pas le password
    const { password, ...result } = user;
    return result;
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: data.email })
      .getOne();

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedError('Identifiants invalides');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Compte désactivé');
    }

    const tokens = this.generateTokens(user);
    
    // Sauvegarder le refresh token (optionnellement haché selon la doc)
    user.refreshToken = tokens.refreshToken;
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const { password, refreshToken, ...userResult } = user;
    return { user: userResult, ...tokens };
  }

  async refresh(token: string) {
    try {
      const decoded = TokenUtil.verifyRefreshToken(token);
      const user = await this.userRepository.findOneBy({ id: decoded.sub, refreshToken: token });

      if (!user || !user.isActive) {
        throw new UnauthorizedError('Session invalide');
      }

      const tokens = this.generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await this.userRepository.save(user);

      return tokens;
    } catch (error) {
      throw new UnauthorizedError('Session expirée');
    }
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: TokenUtil.generateAccessToken(payload),
      refreshToken: TokenUtil.generateRefreshToken(payload),
    };
  }
}
