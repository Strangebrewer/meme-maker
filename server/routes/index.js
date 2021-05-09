import express from 'express';
const router = express.Router();

import authRoutes from './auth';
import contentRoutes from './content';
import externalRoutes from './external';
import imageRoutes from './image';
import organizationRoutes from './organization';
import svgRoutes from './svg';

router.use('/content', contentRoutes);
router.use('/external', externalRoutes);
router.use('/image', imageRoutes);
router.use('/organizations', organizationRoutes);
router.use('/svg', svgRoutes);
router.use('/users', authRoutes);

export default router