import { Router } from "express";
import { WeatherController } from "../controllers";

const router = Router();

router.get("/today/detail/rain", WeatherController.getRain);

export default router;
