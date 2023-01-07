import { Request, Response } from "express";
import WeatherService from "../services/WeatherService";
import sc from "../modules/statusCode";
import rm from "../modules/responseMessage";
import util from "../modules/util"

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
    getWeatherDetail,
    getTempForecast,
    getRainForecast
};
  