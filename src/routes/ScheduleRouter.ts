import { Router } from 'express';
import { ScheduleController } from '../controllers';

const router = Router();

router.get('/observed', ScheduleController.getObserved);
export default router;
