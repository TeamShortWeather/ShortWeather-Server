import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const convertSnakeToCamel = require("../modules/convertSnakeToCamel");
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
moment.suppressDeprecationWarnings = true;

const getRainForecast = async () => {
  let now = moment();
  let date = now.format("YYYYMMDD");
  let time = now.format("HH00");
  
  const start = await prisma.hourly_forecast.findFirst({
    where: {
      date: date,
      time: time,
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.hourly_forecast.findMany({
    where: {
      id: {
        gt: start.id - 1,
      },
    },
    select: {
      time: true,
      rain: true,
    },
    take: 24,
  });
  return result;
};

export default {
  getRainForecast,
};
