import { PrismaClient } from "@prisma/client";
import { TodayWeatherDTO } from "../DTO/WeatherDTO";
const prisma = new PrismaClient();
const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
moment.suppressDeprecationWarnings = true;

let now = moment();
let date = now.format("YYYYMMDD");
let time = now.format("HH00");

//* 오늘 날씨 정보 조회 
const getTodayWeather = async () => {
    //! 동시에 db 출발했다가 먼저 받아오는 친구부터 하도록 수정
    const observedToday = await prisma.observed_weather.findFirst({
        where: {
            date: date,
            time: time,
        }
    });
    const dailyForecast = await prisma.daily_forecast.findFirst({
        where: {
            date: date,
        }
    });
    const yesterday = now.add(-1, 'd').format("YYYYMMDD");
    const observedYesterday = await prisma.observed_weather.findFirst({
        where: {
            date: date,//yesterday,
            time: "0500",//time, //! 수정예정
        }
    });

    if (!observedToday || !observedYesterday || !dailyForecast)
        return null;

    const result: TodayWeatherDTO = {
        location: "종로구",
        compareTemp: observedToday.temperature - observedYesterday.temperature,
        compareMessage: "더어유", //! 미정 - 체감온도
        breakingNews: dailyForecast.warning, //! 특보 -> string 으로 변경
        fineDust: observedToday.pm10,
        ultrafineDust: observedToday.pm25,
        weatherImage: 1, //!미정
        weatherImageDesc: "준비중입니다!", //!미정
        currentTemp: observedToday.temperature,
        minTemp: dailyForecast.min_temp,
        maxTemp: dailyForecast.max_temp,
        weatherMessage: "미정입니다!", //!미정
    }

    return result;
};

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
    getTodayWeather,
    getWeatherDetail,
    getTempForecast,
    getRainForecast,
};

export default WeatherService;
