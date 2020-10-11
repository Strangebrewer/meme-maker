import express from 'express';
const router = express.Router();

import authRoutes from './auth';
import contentRoutes from './content';
import imageRoutes from './image';

router.use('/content', contentRoutes);
router.use('/image', imageRoutes);
router.use('/users', authRoutes);

export default router