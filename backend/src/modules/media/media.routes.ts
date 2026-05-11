import { Router } from 'express';
import { MediaController } from './media.controller';
import { authMiddleware } from '@/middleware/auth/auth.middleware';
import { authorize } from '@/middleware/auth/roles.middleware';
import { UserRole } from '@/common/enums/role.enum';
import { upload } from '@/config/cloudinary.config';

const router = Router();
const controller = new MediaController();

// Seuls les admins peuvent uploader des fichiers
router.use(authMiddleware);
router.use(authorize(UserRole.ADMIN));

router.post('/upload', upload.single('image'), controller.uploadImage);

export default router;
