import { Router } from 'express';
import { ContactController } from './contact.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreateMessageDto, UpdateMessageStatusDto } from './dto/contact.dto';

const router = Router();
const controller = new ContactController();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Gestion des messages de contact et requêtes
 */

/**
 * @swagger
 * /api/v1/contact:
 *   post:
 *     summary: Envoyer un nouveau message de contact
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message envoyé
 */
router.post('/', validationMiddleware(CreateMessageDto), controller.create);

// Routes administratives (Protégées)
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/contact:
 *   get:
 *     summary: Récupérer tous les messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/v1/contact/unread-count:
 *   get:
 *     summary: Obtenir le nombre de messages non lus
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre de messages
 */
router.get('/unread-count', controller.getUnreadCount);

/**
 * @swagger
 * /api/v1/contact/{id}:
 *   get:
 *     summary: Récupérer un message par son ID
 *     tags: [Messages]
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
 *         description: Détails du message
 */
router.get('/:id', controller.findOne);

/**
 * @swagger
 * /api/v1/contact/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'un message
 *     tags: [Messages]
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
 *                 enum: [unread, read, replied, archived]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', validationMiddleware(UpdateMessageStatusDto), controller.setStatus);

/**
 * @swagger
 * /api/v1/contact/{id}/read:
 *   patch:
 *     summary: Marquer un message comme lu
 *     tags: [Messages]
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
 *         description: Message marqué comme lu
 */
router.patch('/:id/read', controller.markAsRead);
/**
 * @swagger
 * /api/v1/contact/{id}/reply:
 *   post:
 *     summary: Répondre à un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réponse stockée
 */
router.post('/:id/reply', controller.reply);

/**
 * @swagger
 * /api/v1/contact/bulk:
 *   delete:
 *     summary: Supprimer plusieurs messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Supprimés avec succès
 */
router.delete('/bulk', controller.bulkDelete);

/**
 * @swagger
 * /api/v1/contact/{id}:
 *   delete:
 *     summary: Supprimer un message
 *     tags: [Messages]
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
 *         description: Message supprimé
 */
router.delete('/:id', controller.remove);

export default router;
