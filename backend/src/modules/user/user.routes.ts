import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { validationMiddleware } from '@/middleware/validation/validation.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { UpdateUserAdminDto } from './dto/user-admin.dto';

const router = Router();
const controller = new UserController();

// TOUTES les routes ici sont administratives
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

router.get('/', controller.findAll);
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Créer un nouvel utilisateur (Admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post('/', controller.create);
router.get('/:id', controller.findOne);
router.put('/:id', validationMiddleware(UpdateUserAdminDto), controller.update);
router.delete('/:id', controller.remove);

export default router;
