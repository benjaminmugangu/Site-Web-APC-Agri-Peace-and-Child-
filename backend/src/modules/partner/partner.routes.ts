import { Router } from 'express';
import { PartnerController } from './partner.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';

const router = Router();
const controller = new PartnerController();

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Gestion des partenaires et bailleurs de fonds
 */

/**
 * @swagger
 * /api/v1/partners:
 *   get:
 *     summary: Récupérer tous les partenaires
 *     tags: [Partners]
 *     responses:
 *       200:
 *         description: Liste des partenaires
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/v1/partners/{id}:
 *   get:
 *     summary: Récupérer un partenaire par son ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du partenaire
 */
router.get('/:id', controller.findOne);

// Routes administratives (Protégées)
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/partners:
 *   post:
 *     summary: Créer un nouveau partenaire
 *     tags: [Partners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partner'
 *     responses:
 *       201:
 *         description: Partenaire créé
 */
router.post('/', validationMiddleware(CreatePartnerDto), controller.create);

/**
 * @swagger
 * /api/v1/partners/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire
 *     tags: [Partners]
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
 *             $ref: '#/components/schemas/Partner'
 *     responses:
 *       200:
 *         description: Partenaire mis à jour
 */
router.put('/:id', validationMiddleware(UpdatePartnerDto), controller.update);

router.delete('/bulk', controller.bulkDelete);

/**
 * @swagger
 * /api/v1/partners/{id}:
 *   delete:
 *     summary: Supprimer un partenaire
 *     tags: [Partners]
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
 *         description: Partenaire supprimé
 */
router.delete('/:id', controller.remove);

export default router;
