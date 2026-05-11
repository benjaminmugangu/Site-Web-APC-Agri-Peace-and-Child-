import { Router } from 'express';
import { TenderController } from './tender.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreateTenderDto, UpdateTenderDto } from './dto/tender.dto';

const router = Router();
const controller = new TenderController();

/**
 * @swagger
 * tags:
 *   name: Tenders
 *   description: Gestion des appels d'offres (Marchés publics)
 */

/**
 * @swagger
 * /api/v1/tenders:
 *   get:
 *     summary: Récupérer tous les appels d'offres
 *     tags: [Tenders]
 *     responses:
 *       200:
 *         description: Liste des appels d'offres
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/v1/tenders/{id}:
 *   get:
 *     summary: Récupérer un appel d'offres par son ID
 *     tags: [Tenders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'appel d'offres
 */
router.get('/:id', controller.findOne);

// Routes administratives (Protégées)
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/tenders:
 *   post:
 *     summary: Créer un nouvel appel d'offres
 *     tags: [Tenders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tender'
 *     responses:
 *       201:
 *         description: Appel d'offres créé
 */
router.post('/', validationMiddleware(CreateTenderDto), controller.create);

/**
 * @swagger
 * /api/v1/tenders/{id}:
 *   put:
 *     summary: Mettre à jour un appel d'offres
 *     tags: [Tenders]
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
 *             $ref: '#/components/schemas/Tender'
 *     responses:
 *       200:
 *         description: Appel d'offres mis à jour
 */
router.put('/:id', validationMiddleware(UpdateTenderDto), controller.update);

router.delete('/bulk', controller.bulkDelete);

/**
 * @swagger
 * /api/v1/tenders/{id}:
 *   delete:
 *     summary: Supprimer un appel d'offres
 *     tags: [Tenders]
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
 *         description: Appel d'offres supprimé
 */
router.delete('/:id', controller.remove);

/**
 * @swagger
 * /api/v1/tenders/{id}/status:
 *   patch:
 *     summary: Changer le statut d'un appel d'offres
 *     tags: [Tenders]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, closed, cancelled, archived]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', controller.setStatus);

export default router;
