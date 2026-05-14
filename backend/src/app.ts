import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorMiddleware } from '@/middleware/error/error.middleware';
import authRoutes from '@/modules/auth/auth.routes';
import projectRoutes from '@/modules/project/project.routes';
import newsRoutes from '@/modules/news/news.routes';
import careerRoutes from '@/modules/career/career.routes';
import serviceRoutes from '@/modules/service/service.routes';
import partnerRoutes from '@/modules/partner/partner.routes';
import teamRoutes from '@/modules/team/team.routes';
import userRoutes from '@/modules/user/user.routes';
import mediaRoutes from '@/modules/media/media.routes';
import tenderRoutes from '@/modules/tender/tender.routes';
import contactRoutes from '@/modules/contact/contact.routes';
import settingsRoutes from '@/modules/settings/settings.routes';
import { ResponseUtil } from '@/common/utils/response.util';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger.config';

dotenv.config();

const app: Application = express();

// 1. Sécurité (Helmet)
app.use(helmet());

// 2. CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (comme Postman ou les outils serveurs)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 3. Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiting (Limiteur global)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use(globalLimiter);

// 5. Routes de base
app.get('/', (req, res) => {
  return ResponseUtil.success(res, 'API APC Web-Site opérationnelle');
});

// 5. Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Modules métiers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/careers', careerRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/tenders', tenderRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/settings', settingsRoutes);

// 7. Gestionnaire d'erreurs (DOIT être le dernier)
app.use(errorMiddleware);

export default app;
