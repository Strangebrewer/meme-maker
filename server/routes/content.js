import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import ContentController from '../controllers/ContentController';

router.route('/')
    .get(isAuthenticated, ContentController.get)
    .post(isAuthenticated, ContentController.post);

router.route('/calendar')
    .get(isAuthenticated, ContentController.getCalendar);

router.route('/render/:slug')
    .get(isAuthenticated, ContentController.getRender);

router.route('/:id')
    .get(isAuthenticated, ContentController.getOne)
    .put(isAuthenticated, ContentController.put)
    .delete(isAuthenticated, ContentController.destroy);

export default router;
