import { Request, Response } from "express";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import weatherService from "../services/WeatherService";

//* [GET] 오늘 날씨 정보 조회 /weather/today
const getTodayWeather = async (req: Request, res: Response) => {
    try {
        const data = await weatherService.getTodayWeather();
        if (!data) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.READ_TODAY_WEATHER_FAIL))
        }
        return res.status(statusCode.OK).send(util.success(statusCode.OK, message.READ_TODAY_WEATHER_SUCCESS, data));
    } catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
};

export default {
    getTodayWeather,
};
