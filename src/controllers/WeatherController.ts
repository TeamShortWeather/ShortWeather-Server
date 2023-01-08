import { Request, Response } from "express";
import ScheduleService from "../services/ScheduleService";
import sc from "../modules/statusCode";
import rm from "../modules/responseMessage";
import util from "../modules/util"
import WeatherService from "../services/WeatherService";

/**
 *  @route GET /weather/today/detail/rain
 *  @desc Get Schedule
 *  @access public
 *  @description 시간대별 날씨 - 강수 조회
 *  @developer 김민욱
 */
const getRain = async (req: Request, res: Response) => {
    try {
    const data = await WeatherService.getRainForecast();

    if (!data) return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));
  
    return res.status(sc.OK).send(util.success(sc.OK, rm.READ_RAIN_WEATHER_SUCCESS, data));
  }catch(error) {
    console.log(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

export default {
    getRain,
  };