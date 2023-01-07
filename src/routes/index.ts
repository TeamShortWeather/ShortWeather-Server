import { Router } from "express";

import AuthRouter from "./AuthRouter";
import ScheduleRouter from "./ScheduleRouter";
import WeatherRouter from "./WeatherRouter";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/schedule", ScheduleRouter);
router.use("/weather", WeatherRouter);

export default router;
