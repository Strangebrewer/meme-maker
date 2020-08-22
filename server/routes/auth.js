import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import UserController from '../controllers/UserController';

router.route('/')
    .get(isAuthenticated, UserController.getCurrentUser)
    .put(isAuthenticated, UserController.put);

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.put('/password', isAuthenticated, UserController.updatePassword);

router.delete('/:id', isAuthenticated, UserController.destroy);

export default router;
