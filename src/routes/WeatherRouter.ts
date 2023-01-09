import { Router } from 'express';
import { WeatherController } from '../controllers';
import authToken from '../modules/authToken';

const router = Router();

//* [GET] 오늘 날씨 정보 조회 /weather/today
router.get('/today', authToken, WeatherController.getTodayWeather);

//* [GET] 오늘 날씨 물음표 멘트 조회 /weather/today/question
router.get('/today/question', authToken, WeatherController.getQuestionMessage);
router.get('/today/detail', WeatherController.getWeatherDetail);
router.get('/today/detail/temp', WeatherController.getTempForecast);
router.get("/today/detail/rain", WeatherController.getRainForecast);

export default router;
