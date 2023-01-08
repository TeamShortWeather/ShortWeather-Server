import { Request, Response } from "express";
import sc from "../modules/statusCode";
import rm from "../modules/responseMessage";
import util from "../modules/util";
import WeatherService from "../services/WeatherService";

/**
 *  @route GET /weather/today
 *  @desc Get Schedule
 *  @access public
 *  @description 오늘 날씨 정보 조회
 *  @developer 강수현
 */
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

/**
 *  @route GET /weather/today/detail/rain
 *  @desc Get Schedule
 *  @access public
 *  @description 시간대별 날씨 - 강수 조회
 *  @developer 김민욱
 */
const getRainForecast = async (req: Request, res: Response) => {
  try {
    const data = await WeatherService.getRainForecast();

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));
    }

    return res
      .status(sc.OK)
      .send(util.success(sc.OK, rm.READ_RAIN_WEATHER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route GET /weather/today/detail
 *  @desc Get Weather
 *  @access public
 *  @description 날씨 디테일
 *  @developer 김도연
 */
const getWeatherDetail = async (req: Request, res: Response) => {
  const data = await WeatherService.getWeatherDetail();

  if (!data)
    return res
      .status(sc.BAD_REQUEST)
      .send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));

  return res
    .status(sc.OK)
    .send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
};

/**
 *  @route GET /weather/today/detail/temp
 *  @desc Get Weather
 *  @access public
 *  @description 시간대별 날씨 온도 조회
 *  @developer 김도연
 */
const getTempForecast = async (req: Request, res: Response) => {
  const data = await WeatherService.getTempForecast();

  if (!data)
    return res
      .status(sc.BAD_REQUEST)
      .send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));

  return res
    .status(sc.OK)
    .send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
};

export default {
    getTodayWeather,
    getWeatherDetail,
    getTempForecast,
    getRainForecast,
};
