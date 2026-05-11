import { Router } from 'express';
import { NewsController } from './news.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

const router = Router();
const controller = new NewsController();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Gestion des actualités et articles
 */

/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     summary: Récupérer toutes les actualités
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des actualités
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/v1/news/{id}:
 *   get:
 *     summary: Récupérer une actualité par son ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'actualité
 *       404:
 *         description: Actualité introuvable
 */
router.get('/:id', controller.findOne);

// Routes administratives (Protégées)
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/news:
 *   post:
 *     summary: Créer une nouvelle actualité
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       201:
 *         description: Actualité créée
 */
router.post('/', validationMiddleware(CreateNewsDto), controller.create);

/**
 * @swagger
 * /api/v1/news/{id}:
 *   put:
 *     summary: Mettre à jour une actualité
 *     tags: [News]
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
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       200:
 *         description: Actualité mise à jour
 */
router.put('/:id', validationMiddleware(UpdateNewsDto), controller.update);

router.delete('/bulk', controller.bulkDelete);

/**
 * @swagger
 * /api/v1/news/{id}:
 *   delete:
 *     summary: Supprimer une actualité
 *     tags: [News]
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
 *         description: Actualité supprimée
 */
router.delete('/:id', controller.remove);

router.patch('/bulk-status', controller.bulkSetStatus);
router.post('/:id/duplicate', controller.duplicate);
router.patch('/:id/publish', controller.publish);

/**
 * @swagger
 * /api/v1/news/{id}/status:
 *   patch:
 *     summary: Changer le statut d'une actualité
 *     tags: [News]
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
 *                 enum: [draft, published, scheduled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', controller.setStatus);

export default router;
