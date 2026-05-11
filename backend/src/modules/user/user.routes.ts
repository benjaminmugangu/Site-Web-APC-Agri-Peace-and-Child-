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
router.get('/:id', controller.findOne);
router.put('/:id', validationMiddleware(UpdateUserAdminDto), controller.update);
router.delete('/:id', controller.remove);

export default router;
