import express from 'express';
const router = express.Router();

import authRoutes from './auth';
import contentRoutes from './content';
import externalRoutes from './external';
import imageRoutes from './image';
import svgRoutes from './svg';

router.use('/content', contentRoutes);
router.use('/external', externalRoutes);
router.use('/image', imageRoutes);
router.use('/svg', svgRoutes);
router.use('/users', authRoutes);

export default router