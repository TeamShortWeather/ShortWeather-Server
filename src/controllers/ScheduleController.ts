import { Request, Response } from "express";
import ScheduleService from "../services/ScheduleService";
import sc from "../modules/statusCode";
import rm from "../modules/responseMessage";
import util from "../modules/util";

/**
 *  @route POST /schedule/observed
 *  @desc Post Schedule
 *  @access public
 *  @description 관측 날씨 조회
 *  @developer 강수현
 */
const createObserved = async (req: Request, res: Response) => {
  try {
    const data = await ScheduleService.createObserved();

    if (!data)
      return res
        .status(sc.BAD_REQUEST)
        .send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));

    return res
      .status(sc.OK)
      .send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

/**
 *  @route POST /schedule/forecast/daily
 *  @desc Post Schedule
 *  @access public
 *  @description 예보 하루단위
 *  @developer 김도연
 */
const createDailyForecast = async (req: Request, res: Response) => {
  const data = await ScheduleService.createDailyForecast();

  return res
    .status(200)
    .json({ status: 200, message: "하루 예보 저장 성공", data: data });
};

/**
 *  @route PUT /schedule/forecast/daily
 *  @desc Post Schedule
 *  @access public
 *  @description 예보 기상지수 업데이트
 *  @developer 김도연
 */
 const updateDailyForecast = async (req: Request, res: Response) => {
  const data = await ScheduleService.updateDailyForecast();

  return res
    .status(200)
    .json({ status: 200, message: "기상지수 저장 성공", data: data });
};

/**
 *  @route POST /schedule/forecast/hourly
 *  @desc Post Schedule
 *  @access public
 *  @description 예보 시간단위
 *  @developer 김민욱
 */
const createHourlyForecast = async (req: Request, res: Response) => {
  const data = await ScheduleService.createHourlyForecast();

  if (!data) {
    return res
      .status(sc.BAD_REQUEST)
      .send(util.fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  return res
    .status(200)
    .json({ status: 200, message: "시간 예보 저장 성공", data: data });
};

export default {
  createObserved,
  createDailyForecast,
  createHourlyForecast,
  updateDailyForecast,
};
