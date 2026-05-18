import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { LoginDto } from './dto/auth.dto';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification et des sessions
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Se connecter à l'application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', validationMiddleware(LoginDto), controller.login);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             description: Le refresh token (optionnel si envoyé via Cookie)
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *       401:
 *         description: Session invalide ou expirée
 */
router.post('/refresh', controller.refresh);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Se déconnecter
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', authMiddleware, controller.logout);

export default router;
