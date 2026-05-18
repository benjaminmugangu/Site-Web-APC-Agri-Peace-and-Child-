import bcrypt from 'bcryptjs';
import { AppDataSource } from '@/config/database.config';
import { User } from '@/entities/user.entity';
import { LoginDto } from './dto/auth.dto';
import { BadRequestError, UnauthorizedError } from '@/common/utils/error.util';
import { TokenUtil } from '@/common/utils/token.util';
import { UserRole } from '@/common/enums/role.enum';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

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
    
    // Sauvegarder le refresh token haché
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const { password, refreshToken, ...userResult } = user;
    return { user: userResult, ...tokens };
  }

  async refresh(token: string) {
    try {
      const decoded = TokenUtil.verifyRefreshToken(token);
      
      // On récupère l'utilisateur en incluant explicitement le refreshToken (caché par défaut)
      const user = await this.userRepository.createQueryBuilder('user')
        .addSelect('user.refreshToken')
        .where('user.id = :id', { id: decoded.sub })
        .getOne();

      if (!user || !user.isActive || !user.refreshToken) {
        throw new UnauthorizedError('Session invalide');
      }

      // On vérifie que le token reçu correspond au hash en BDD
      const isTokenValid = await bcrypt.compare(token, user.refreshToken);
      if (!isTokenValid) {
        throw new UnauthorizedError('Session invalide');
      }

      const tokens = this.generateTokens(user);
      
      // On hache le nouveau token avant sauvegarde
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      await this.userRepository.save(user);

      return tokens;
    } catch (error) {
      throw new UnauthorizedError('Session expirée');
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null as any });
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: TokenUtil.generateAccessToken(payload),
      refreshToken: TokenUtil.generateRefreshToken(payload),
    };
  }
}
