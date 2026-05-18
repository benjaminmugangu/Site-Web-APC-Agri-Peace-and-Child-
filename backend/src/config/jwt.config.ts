import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_key_change_me',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_change_me',
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '1d',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
};
