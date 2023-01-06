import { Request, Response } from "express";
import ScheduleService from "../services/ScheduleService";
import sc from "../modules/statusCode";
import rm from "../modules/responseMessage";
import util from "../modules/util"

//* 관측 날씨 조회
const getObserved = async (req: Request, res: Response) => {

  const data = await ScheduleService.getObserved();

  if (!data) return res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.READ_OBSERVED_WEATHER_FAIL));

  return res.status(sc.OK).send(util.success(sc.OK, rm.READ_OBSERVED_WEATHER_SUCCESS, data));
};

export default {
  getObserved,
};
