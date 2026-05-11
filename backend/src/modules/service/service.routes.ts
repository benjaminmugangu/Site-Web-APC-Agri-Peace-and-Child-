import { Router } from 'express';
import { ServiceController } from './service.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

const router = Router();
const controller = new ServiceController();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Gestion des piliers d'intervention et services
 */

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: Récupérer tous les services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste des services
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   get:
 *     summary: Récupérer un service par son ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du service
 */
router.get('/:id', controller.findOne);

// Routes administratives (Protégées)
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/services:
 *   post:
 *     summary: Créer un nouveau service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service créé
 */
router.post('/', validationMiddleware(CreateServiceDto), controller.create);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   put:
 *     summary: Mettre à jour un service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service mis à jour
 */
router.put('/:id', validationMiddleware(UpdateServiceDto), controller.update);

router.delete('/bulk', controller.bulkDelete);

/**
 * @swagger
 * /api/v1/services/{id}:
 *   delete:
 *     summary: Supprimer un service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service supprimé
 */
router.delete('/:id', controller.remove);

export default router;
