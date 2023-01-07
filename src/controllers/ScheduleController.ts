import { Request, Response } from "express";
import ScheduleService from "../services/ScheduleService";
import sc from "../modules/statusCode";
import rm from "../modules/responseMessage";
import util from "../modules/util"

//* 관측 날씨 조회
const createObserved = async (req: Request, res: Response) => {

  const data = await ScheduleService.createObserved();

  if (!data) return res.status(sc.BAD_REQUEST).send(util.fail(sc.BAD_REQUEST, rm.READ_OBSERVED_WEATHER_FAIL));

  return res.status(sc.OK).send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
};

const createDailyForecast = async (req: Request, res: Response) => {
  const data = await ScheduleService.createDailyForecast();

  return res.status(200).json({ status: 200, message: "하루 예보 저장 성공", data: data });
};

export default {
  createObserved,
  createDailyForecast
};
