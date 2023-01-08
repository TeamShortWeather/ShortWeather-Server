import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
moment.suppressDeprecationWarnings = true;

let now = moment();
let date = now.format("YYYYMMDD");
let time = now.format("HH00");

const getRainForecast = async () => {
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

const getWeatherDetail = async () => {
  const user = await prisma.user.findUnique({
    where: {
      id: 1,
    },
  });
  const observed = await prisma.observed_weather.findFirst();
  const daily = await prisma.daily_forecast.findFirst();

  const data = {
    goOut: {
      time: user.go_out_time,
    },
    goHome: {
      time: user.go_home_time,
    },
    todayWeather: {
      humidity: observed.humidity,
      surise: daily.sunrise,
      sunset: daily.sunset,
      fineDust: observed.pm25,
      ultraFineDust: observed.pm10,
    },
  };

  return data;
};

const getTempForecast = async () => {
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
      id: true,
      date: true,
      time: true,
      temperature: true,
      sky: true,
      pty: true,
    },
    take: 24,
  });

  console.log(result.length);
  return result;
};

const WeatherService = {
  getWeatherDetail,
  getTempForecast,
  getRainForecast,
};

export default WeatherService;
