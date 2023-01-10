import { Router } from "express";
import ScheduleController from "../controllers/ScheduleController";

const router = Router();

router.post("/observed", ScheduleController.createObserved);
router.post("/forecast/daily", ScheduleController.createDailyForecast);
router.post("/forecast/hourly", ScheduleController.createHourlyForecast);
router.patch("/forecast/daily", ScheduleController.updateDailyForecast);

export default router;
