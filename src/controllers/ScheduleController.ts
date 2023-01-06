import { Request, Response } from "express";
import ScheduleService from "../services/ScheduleService";

const createDailyForecast = async (req: Request, res: Response) => {
  const data = await ScheduleService.createDailyForecast();

  return res.status(200).json({ status: 200, message: "하루 예보 저장 성공", data: data });
};


export default {
    createDailyForecast
};