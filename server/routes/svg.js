import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import SVGController from '../controllers/SVGController';

router.route('/')
    .get(isAuthenticated, SVGController.get)
    .post(isAuthenticated, SVGController.post);

router.route('/:id')
    .get(isAuthenticated, SVGController.getOne)
    .put(isAuthenticated, SVGController.put)
    .delete(isAuthenticated, SVGController.destroy);

export default router;
