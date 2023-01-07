import { PrismaClient } from "@prisma/client";
import { WeatherInfoDTO } from '../DTO/WeatherDTO';
import dayjs from "dayjs";
import { database } from "firebase-admin";

const prisma = new PrismaClient();

let now = dayjs();
const date = now.format("YYYYMMDD");
const time = now.format("HH00");

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
            time: user.go_out_time
        },
        goHome: {
            time: user.go_home_time
        },
        todayWeather: {
            humidity: observed.humidity,
            surise: daily.sunrise,
            sunset: daily.sunset,
            fineDust: observed.pm25,
            ultraFineDust: observed.pm10
        }
    }

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
    })

    const result = await prisma.hourly_forecast.findMany({
        where: {
          id: {
            gt: start.id-1,
          }
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
    })

    console.log(result.length)
    return result;
};

const getRainForecast = async () => {

    const data = {}
    
    return data;
};

const WeatherService = {
    getWeatherDetail,
    getTempForecast,
    getRainForecast
}
  
export default WeatherService;