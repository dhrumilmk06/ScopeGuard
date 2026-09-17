import { Router } from 'express';
import { AuthController } from './authController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// Protected routes (require JWT token)
router.get('/me', authMiddleware, AuthController.getMe);
router.put('/profile', authMiddleware, AuthController.updateProfile);

export default router;
