import { PrismaClient } from "@prisma/client";
import { TodayWeatherDTO } from "../DTO/WeatherDTO";
import dayjs from "dayjs";
const prisma = new PrismaClient();

//* 오늘 날씨 정보 조회 
const getTodayWeather = async () => {
    //! 동시에 db 출발했다가 먼저 받아오는 친구부터 하도록 수정
    const now = dayjs();
    let date = now.format("YYYYMMDD");
    const time = now.format("HH:00"); //! :제외로 수정 예정
    const observedToday = await prisma.observed_weather.findFirst({
        where: {
            date: date,
            time: "02:00",//time,
        }
    });
    const dailyForecast = await prisma.daily_forecast.findFirst({
        where: {
            date: date,
        }
    });
    date = now.add(-1, 'd').format("YYYYMMDD");
    const observedYesterday = await prisma.observed_weather.findFirst({
        where: {
            date: date,
            time: "18:00",//time,
        }
    });

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

const weatherService = {
    getTodayWeather,
};

export default weatherService;
