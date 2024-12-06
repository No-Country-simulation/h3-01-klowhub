import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import courseRoutes from './course.routes';
import membershipRoutes from './membership.routes'
import userProRoutes from './userPro.routes'
import oAuthrouter from './oAuth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/membership', membershipRoutes);
router.use('/userPro', userProRoutes);
router.use('/googleUser', oAuthrouter);

export default router;
