import { Router } from 'express';
import WeatherController from '../controllers/WeatherController';

const router = Router();

router.get('/today/detail', WeatherController.getWeatherDetail);
router.get('/today/detail/temp', WeatherController.getTempForecast);
router.get("/today/detail/rain", WeatherController.getRain);

export default router;
