import express from 'express';
const router = express.Router();
import isAuthenticated from '../policies/isAuthenticated';
import ExternalAPIController from '../controllers/ExternalAPIController';

router.get('/weather', isAuthenticated, ExternalAPIController.getWeather);
router.get('/stock', isAuthenticated, ExternalAPIController.getStock);

export default router;