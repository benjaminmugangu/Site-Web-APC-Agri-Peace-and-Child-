import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { UpdateSettingsDto } from './dto/settings.dto';

const router = Router();
const controller = new SettingsController();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Configuration dynamique du site (Hero, Stats, Contact)
 */

/**
 * @swagger
 * /api/v1/settings:
 *   get:
 *     summary: Récupérer les paramètres globaux du site
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Paramètres actuels
 */
router.get('/', controller.getSettings);

// Route administrative pour mettre à jour
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/settings:
 *   put:
 *     summary: Mettre à jour les paramètres globaux
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: Paramètres mis à jour
 */
router.put('/', validationMiddleware(UpdateSettingsDto), controller.updateSettings);

export default router;
