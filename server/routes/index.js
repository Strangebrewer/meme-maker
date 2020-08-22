import express from 'express';
const router = express.Router();

import authRoutes from './auth';
import contentRoutes from './content';

router.use('/content', contentRoutes);
router.use('/users', authRoutes);

export default router