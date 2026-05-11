import { Router } from 'express';
import { CareerController } from './career.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreateCareerDto, UpdateCareerDto } from './dto/career.dto';

const router = Router();
const controller = new CareerController();

/**
 * @swagger
 * tags:
 *   name: Careers
 *   description: Gestion des opportunités d'emploi et appels d'offres
 */

/**
 * @swagger
 * /api/v1/careers:
 *   get:
 *     summary: Récupérer toutes les opportunités (emplois/appels d'offres)
 *     tags: [Careers]
 *     responses:
 *       200:
 *         description: Liste des opportunités
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/v1/careers/{id}:
 *   get:
 *     summary: Récupérer une opportunité par son ID
 *     tags: [Careers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'opportunité
 */
router.get('/:id', controller.findOne);

// Routes administratives (Protégées)
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/careers:
 *   post:
 *     summary: Créer une nouvelle opportunité
 *     tags: [Careers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Career'
 *     responses:
 *       201:
 *         description: Opportunité créée
 */
router.post('/', validationMiddleware(CreateCareerDto), controller.create);

/**
 * @swagger
 * /api/v1/careers/{id}:
 *   put:
 *     summary: Mettre à jour une opportunité
 *     tags: [Careers]
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
 *             $ref: '#/components/schemas/Career'
 *     responses:
 *       200:
 *         description: Opportunité mise à jour
 */
router.put('/:id', validationMiddleware(UpdateCareerDto), controller.update);

router.delete('/bulk', controller.bulkDelete);

/**
 * @swagger
 * /api/v1/careers/{id}:
 *   delete:
 *     summary: Supprimer une opportunité
 *     tags: [Careers]
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
 *         description: Opportunité supprimée
 */
router.delete('/:id', controller.remove);

router.patch('/bulk-status', controller.bulkSetStatus);

export default router;
