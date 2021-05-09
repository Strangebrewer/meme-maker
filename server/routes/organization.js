import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import OrganizationController from '../controllers/OrganizationController';

router.route('/')
    .get(isAuthenticated, OrganizationController.get)
    .put(isAuthenticated, OrganizationController.put)
    .post(isAuthenticated, OrganizationController.post)

router.route('/:id')
    .get(isAuthenticated, OrganizationController.getOne)
    .delete(isAuthenticated, OrganizationController.destroy);

export default router;
