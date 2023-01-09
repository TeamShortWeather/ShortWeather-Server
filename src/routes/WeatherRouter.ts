import { Router } from 'express';
import { WeatherController } from '../controllers';
import authToken from '../modules/authToken';
import auth from "../middleware/auth";

const router = Router();

//* [GET] 오늘 날씨 정보 조회 /weather/today
router.get('/today', authToken, WeatherController.getTodayWeather);
router.get('/today/detail', auth, WeatherController.getWeatherDetail);
router.get('/today/detail/temp', WeatherController.getTempForecast);
router.get("/today/detail/rain", WeatherController.getRainForecast);

export default router;
