import { Request, Response } from "express";
import WeatherService from "../services/WeatherService";
import sc from "../modules/statusCode";
import rm from "../modules/responseMessage";
import util from "../modules/util";

//* [GET] 오늘 날씨 정보 조회 /weather/today
const getTodayWeather = async (req: Request, res: Response) => {
    try {
        const data = await WeatherService.getTodayWeather();
        if (!data) {
            return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.READ_TODAY_WEATHER_FAIL))
        }
        return res.status(sc.OK).send(util.success(sc.OK, rm.READ_TODAY_WEATHER_SUCCESS, data));
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const getWeatherDetail = async (req: Request, res: Response) => {
    const data = await WeatherService.getWeatherDetail();

    if (!data) return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));

    return res.status(sc.OK).send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
};

const getTempForecast = async (req: Request, res: Response) => {
    const data = await WeatherService.getTempForecast();

    if (!data) return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));

    return res.status(sc.OK).send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
};

const getRainForecast = async (req: Request, res: Response) => {
    const data = await WeatherService.getRainForecast();

    if (!data) return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));

    return res.status(sc.OK).send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
};

export default {
    getTodayWeather,
    getWeatherDetail,
    getTempForecast,
    getRainForecast,
};
