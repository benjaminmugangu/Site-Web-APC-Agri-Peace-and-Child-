import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config/jwt.config';

export class TokenUtil {
  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiration as any,
    });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiration as any,
    });
  }

  static verifyRefreshToken(token: string): any {
    return jwt.verify(token, jwtConfig.refreshSecret);
  }
}
