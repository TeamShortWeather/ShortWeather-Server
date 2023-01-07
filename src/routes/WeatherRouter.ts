import { Router } from 'express';
import WeatherController from '../controllers/WeatherController';

const router = Router();

router.get('/today/detail', WeatherController.getWeatherDetail);

export default router;
