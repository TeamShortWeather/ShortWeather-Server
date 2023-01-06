import { Router } from "express";

import AuthRouter from "./AuthRouter";
import ScheduleRouter from "./ScheduleRouter";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/schedule", ScheduleRouter);

export default router;
