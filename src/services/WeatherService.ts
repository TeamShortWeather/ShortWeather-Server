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
const yesterday = now.add(-1, "d").format("YYYYMMDD");

const sky = ['', '맑음', '', '구름많음', '흐림'];
const pty = ['비', '비 또는 눈', '눈', '소나기', '이슬비', '진눈깨비', '눈날림'];

const dayNight = (time: String) => {
  if (time < '1700' && time >= '0500') {
    return true
  }
  return false;
}

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
  const observedYesterday = await prisma.observed_weather.findFirst({
    where: {
      date: yesterday,
      time: time,
    }
  });

  const verifyLiving = () => {
    if(dailyForecast.living) {
      if(dailyForecast.living == 3 && observedToday.pm10 != 1){
        return false;
      }
      return true;
    }
  };

  const condition = () => {
    if(dailyForecast.warning)
      return { warning: dailyForecast.warning, };
    if(verifyLiving()) {
      return {
        living: dailyForecast.living,
        living_grade: dailyForecast.living_grade,
      };
    }
    let rainGrade = 1;
    if (observedToday.rain > 60) rainGrade = 3;
    else if (observedToday.rain > 50) rainGrade = 2;
    return { rain: rainGrade, };
  }

  const weatherMessage = await prisma.today_message.findMany({
    where: condition(),
    select: {
      message: true,
    },
  });

  if (!observedToday || !observedYesterday || !dailyForecast || !weatherMessage)
    return null;

  const messageCount = weatherMessage.length;
  const messageIdx = Math.floor(Math.random() * messageCount);

  //! 덥다, 춥다, 비슷하다 - 몇도 차이일때 기준?
  const getCompareMessage = (
    todayTemp: number,
    yesterdayTemp: number,
    month: number
  ) => {
    const compareMessages = [
      "어제보다 따뜻해요",
      "어제보다 추워요",
      "어제보다 더워요",
      "어제보다 선선해요",
      "어제보다 따뜻해요",
      "어제보다 서늘해요",
      "어제와 비슷해요",
    ];
    if (todayTemp == yesterdayTemp) {
      return compareMessages[6];
    }
    let idx = 0; //겨울
    if (month == 5 || month == 9) {
      // 봄 / 가을
      idx = 4;
    } else if (month > 3 && month < 9) {
      // 여름
      idx = 2;
    }
    if (todayTemp < yesterdayTemp) idx++;
    return compareMessages[idx];
  };
  const compareMessage = getCompareMessage(
    observedToday.sensory_temperature,
    observedYesterday.sensory_temperature,
    now.month() + 1
  );
  const image = (observedToday.sky != 0) ? sky[observedToday.sky] : pty[observedToday.pty];

  const breakingNewsArr = ['', '강풍', '호우', '한파', '건조', '폭풍해일', '풍랑', '태풍', '대설', '황사', '', '', '폭염'];
  const breakingNews = !dailyForecast.warning ? null : breakingNewsArr[dailyForecast.warning] + '특보';

  const result: TodayWeatherDTO = {
    location: "서울, 중구 명동",
    compareTemp: observedToday.temperature - observedYesterday.temperature,
    compareMessage: compareMessage,
    breakingNews: breakingNews,
    fineDust: observedToday.pm10,
    ultrafineDust: observedToday.pm25,
    day: dayNight(time),
    image: image,
    currentTemp: observedToday.temperature,
    minTemp: dailyForecast.min_temp,
    maxTemp: dailyForecast.max_temp,
    weatherMessage: weatherMessage[messageIdx].message,
  };

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
      date: true,
      time: true,
      rain: true,
    },
    take: 24,
  });

  return result;
};

const getWeatherDetail = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const goOut = await prisma.hourly_forecast.findMany({
    where: {
      date: date,
      time: user.go_out_time,
    },
    select: {
      temperature: true,
      sky: true,
      pty: true,
    },
  });

  const goHome = await prisma.hourly_forecast.findMany({
    where: {
      date: date,
      time: user.go_home_time,
    },
    select: {
      temperature: true,
      sky: true,
      pty: true,
    },
  });

  const image = goOut[0].sky != 0 ? sky[goOut[0].sky] : pty[goOut[0].pty];

  const observed = await prisma.observed_weather.findFirst();
  const daily = await prisma.daily_forecast.findFirst();

  const data = {
    location: "서울, 중구 명동",
    goOut: {
      time: user.go_out_time,
      temp: goOut[0].temperature,
      day: dayNight(user.go_out_time),
      image: image,
    },
    goHome: {
      time: user.go_home_time,
      temp: goHome[0].temperature,
      day: dayNight(user.go_home_time),
      image: image,
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

  const hourly = await prisma.hourly_forecast.findMany({
    where: {
      id: {
        gte: start.id,
      },
    },
    select: {
      date: true,
      time: true,
      temperature: true,
      sky: true,
      pty: true,
    },
    take: 24,
  });

  const result = hourly.map((element) => {
    return {
      date: element.date,
      time: element.time,
      temperature: element.temperature,
      day: dayNight(element.time),
      image: element.sky != 0 ? sky[element.sky] : pty[element.pty],
    };
  });

  return result;
};

const getQuestionMessage = async () => {
  const todayWeather = await prisma.observed_weather.findFirst({
    where: {
      date: yesterday,
    },
    select: {
      temperature: true,
    },
  });
  const dailyForecast = await prisma.daily_forecast.findFirst({
    where: {
      date: yesterday,
    },
    select: {
      warning: true,
    },
  });
  const weatherMessage = await prisma.yesterday_message.findMany({
    where: {
      warning: dailyForecast.warning ?? 3,
    },
    select: {
      message: true,
    },
  });
  const messageCount = weatherMessage.length;
  const messageIdx = Math.floor(Math.random() * messageCount);

  const data = {
    temp: todayWeather.temperature,
    weatherMessage: weatherMessage[messageIdx].message,
  };

  return data;
};

const WeatherService = {
  getTodayWeather,
  getWeatherDetail,
  getTempForecast,
  getRainForecast,
  getQuestionMessage,
};

export default WeatherService;
