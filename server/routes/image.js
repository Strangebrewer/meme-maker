import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import ImageController from '../controllers/ImageController';

router.route('/')
    .get(isAuthenticated, ImageController.get)
    .post(isAuthenticated, ImageController.post);

router.route('/:id')
    .get(isAuthenticated, ImageController.getOne)
    .delete(isAuthenticated, ImageController.destroy);

export default router;
