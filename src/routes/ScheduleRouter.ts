import { Router } from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router = Router();

router.post('/forecast/daily', ScheduleController.createDailyForecast);

export default router;
