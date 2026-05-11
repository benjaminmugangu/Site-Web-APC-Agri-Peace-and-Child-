import { Router } from 'express';
import { ProjectController } from './project.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

const router = Router();
const controller = new ProjectController();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Gestion des projets humanitaires et de développement
 */

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Récupérer tous les projets
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Liste des projets
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Récupérer un projet par son ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du projet
 */
router.get('/:id', controller.findOne);

// Routes administratives (Protégées)
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Projet créé
 */
router.post('/', validationMiddleware(CreateProjectDto), controller.create);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     summary: Mettre à jour un projet
 *     tags: [Projects]
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
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Projet mis à jour
 */
router.put('/:id', validationMiddleware(UpdateProjectDto), controller.update);

router.delete('/bulk', controller.bulkDelete);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projects]
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
 *         description: Projet supprimé
 */
router.delete('/:id', controller.remove);

router.post('/:id/duplicate', controller.duplicate);
router.patch('/bulk-status', controller.bulkSetStatus);
router.patch('/:id/publish', controller.publish);
router.patch('/:id/archive', controller.archive);

/**
 * @swagger
 * /api/v1/projects/{id}/status:
 *   patch:
 *     summary: Changer le statut d'un projet
 *     tags: [Projects]
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
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/status', controller.setStatus);

export default router;
