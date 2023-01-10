import { HourlyForecastDTO } from "./../DTO/ScheduleDTO";
import { PrismaClient } from "@prisma/client";
import { DailyForecastDTO } from "../DTO/ScheduleDTO";
import axios from "axios";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
moment.suppressDeprecationWarnings = true;

const prisma = new PrismaClient();

interface Weather {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: number;
  ny: number;
  obsrValue: number;
}

//* 관측 날씨 저장
const createObserved = async () => {
  let now = moment();
  if (now.get("m") < 40) {
    now = now.add(-1, "h");
  }
  const time = now.format("HH00");
  const date = now.format("YYYYMMDD");

  const ultraSrtNcstUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
  queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("1000"); /* */
  queryParams += "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("JSON"); /* */
  queryParams += "&" + encodeURIComponent("base_date") + "=" + encodeURIComponent(date); /* */
  queryParams += "&" + encodeURIComponent("base_time") + "=" + encodeURIComponent(time); /* */
  queryParams += "&" + encodeURIComponent("nx") + "=" + encodeURIComponent("60"); /* */
  queryParams += "&" + encodeURIComponent("ny") + "=" + encodeURIComponent("127"); /* */

  const dustUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";
  let dustQueryParams = "?" + encodeURIComponent("serviceKey") + "=" + `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  dustQueryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
  dustQueryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("1000"); /* */
  dustQueryParams += "&" + encodeURIComponent("returnType") + "=" + encodeURIComponent("JSON"); /* */
  dustQueryParams += "&" + encodeURIComponent("sidoName") + "=" + encodeURIComponent("서울"); /* */
  dustQueryParams += "&" + encodeURIComponent("ver") + "=" + encodeURIComponent("1.3"); /* */

  let forecastNow = moment();
  if (forecastNow.get("m") < 45) {
    forecastNow = forecastNow.add(-1, "h");
  }
  let forecastTime = forecastNow.format("HH00");
  const forecastDate = forecastNow.format("YYYYMMDD");

  const ultraSrtFcstUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
  let fcstQueryParams = '?' + encodeURIComponent('serviceKey') + '=' + `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  fcstQueryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
  fcstQueryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
  fcstQueryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
  fcstQueryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(forecastDate); /* */
  fcstQueryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(forecastTime); /* */
  fcstQueryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('60'); /* */
  fcstQueryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); /* */

  forecastNow = forecastNow.add('h', 1);
  forecastTime = forecastNow.format("HH00");

  function fcstFilter(item) {
    const array = ["SKY", "PTY"];
    if (array.includes(item.category) && item.fcstTime == forecastTime) {
      return true;
    }
    return false;
  }

  function filter(item: Weather) {
    //* REH - 습도, RN1 - 강수, T1H - 기온, WSD - 풍속
    const array = ["T1H", "RN1", "REH", 'WSD'];
    if (array.includes(item.category)) {
      return true;
    }
    return false;
  }

  function dustFilter(item) {
    const array = ['중구', '종로구'];
    if (array.includes(item.stationName))
      return true;
    return false;
  }

  let ultraSrtNcst, dust, ultraSrtFcst;

  await axios.all([axios.get(ultraSrtNcstUrl + queryParams), axios.get(dustUrl + dustQueryParams), axios.get(ultraSrtFcstUrl + fcstQueryParams)])
    .then(axios.spread((ncstResult, dustResult, fcstResult) => {
      const ncstRes = ncstResult.data.response;
      if (ncstRes.header.resultCode == "00") {
        const ncstData = ncstResult.data.response.body.items.item;
        const filtered = ncstData.filter(filter);
        const value = filtered.map((element: Weather) => {
          return { category: element.category, obsrValue: element.obsrValue };
        });
        ultraSrtNcst = value;
      }

      const dustRes = dustResult.data.response;
      if (dustRes.body.totalCount != 0) {
        const dustData = dustRes.body.items;
        const dustFiltered = dustData.filter(dustFilter);
        dust = {
          pm25: dustFiltered[0].pm25Grade1h ?? dustFiltered[1].pm25Grade1h,
          pm10: dustFiltered[0].pm10Grade1h ?? dustFiltered[1].pm25Grade1h
        };
      }

      const fcstRes = fcstResult.data.response;
      if (fcstRes.header.resultCode == "00") {
        const fcstData = fcstRes.body.items.item;
        const fcstFiltered = fcstData.filter(fcstFilter);
        const fcstValue = fcstFiltered.map((element) => {
          return { category: element.category, obsrValue: element.fcstValue };
        });
        ultraSrtFcst = fcstValue;
      }
    }))
    .catch((err) => console.log(err));

  let temp, humidity, rain, wind, sensTemp;
  const past = moment().add(-1, "h")
  const pastDate = past.format("YYYYMMDD");
  const pastTime = past.format("HH00");
  if (ultraSrtNcst == undefined) {
    const past_observed = await prisma.observed_weather.findFirst({
      where: {
        date: pastDate,
        time: pastTime,
      },
      select: {
        temperature: true,
        rain: true,
        humidity: true,
        sensory_temperature: true,
        wind: true,
      }
    });
    temp = past_observed.temperature;
    humidity = past_observed.humidity;
    rain = past_observed.rain;
    sensTemp = past_observed.sensory_temperature;
    wind = past_observed.wind;
  } else {
    temp = Math.floor(+ultraSrtNcst[2].obsrValue);
    humidity = +ultraSrtNcst[0].obsrValue;
    rain = Math.round(+ultraSrtNcst[1].obsrValue);
    wind = +ultraSrtNcst[3].obsrValue;

    sensTemp = temp;
    const month = moment().month() + 1;

    if (month > 4 && month < 10) { //여름철
      const tw = temp * Math.atan(0.151977 * Math.pow(humidity + 8.313659, 1 / 2)) + Math.atan(temp + humidity) - Math.atan(humidity - 1.67633) + 0.00391838 * Math.pow(humidity, 3 / 2) * Math.atan(0.023101 * humidity) - 4.686035;
      sensTemp = -0.2442 + 0.55399 * tw + 0.45535 * temp + (-0.0022 * Math.pow(tw, 2)) + 0.00278 * tw * temp + 3.0;
    } else if (temp <= 10 && wind >= 1.3) { //겨울철
      sensTemp = 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * Math.pow(wind, 0.16) * temp;
    }
    sensTemp = Math.floor(sensTemp);
  }
  if (dust == undefined) {
    const past_dust = await prisma.observed_weather.findFirst({
      where: {
        date: pastDate,
        time: pastTime,
      },
      select: {
        pm10: true,
        pm25: true,
      },
    });
    dust = {
      pm25: past_dust.pm25,
      pm10: past_dust.pm10
    };
  }

  let sky, pty;
  if (ultraSrtFcst == undefined) {
    const past_fcst = await prisma.observed_weather.findFirst({
      where: {
        date: pastDate,
        time: pastTime,
      },
      select: {
        pty: true,
        sky: true,
      },
    });
    sky = past_fcst.sky;
    pty = past_fcst.pty;
  } else {
    sky = +ultraSrtFcst[1].obsrValue;
    pty = +ultraSrtFcst[0].obsrValue;
  }

  const data = {
    date: moment().format("YYYYMMDD"),
    time: moment().format("HH00"),
    temperature: temp,
    humidity: humidity,
    pm25: +dust.pm25,
    pm10: +dust.pm10,
    rain: rain,
    sensory_temperature: sensTemp,
    sky: sky,
    pty: pty,
    wind: wind,
  };

  const result = await prisma.observed_weather.create({ data });
  //console.log("result", result);
  return result;
};

const createDailyForecast = async () => {
  const date = moment().format("YYYYMMDD");

  const sunUrl = 'http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo';
  let sunQueryParams = '?' + encodeURIComponent('serviceKey') + '=vIpsf9%2FsPoI5izpvvyzFGPI7SPyElJCB43d%2BwRQeygk%2FSbl%2Bg%2Fz9y8wWyZpZ2jeUOw6kXEURYdAg%2BZMEfpNH6Q%3D%3D'; /* Service Key*/
  sunQueryParams += '&' + encodeURIComponent('locdate') + '=' + encodeURIComponent(date);
  sunQueryParams += '&' + encodeURIComponent('location') + '=' + encodeURIComponent('서울');

  const fcstUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
  let fcstQueryParams = '?' + encodeURIComponent('serviceKey') + '=vIpsf9%2FsPoI5izpvvyzFGPI7SPyElJCB43d%2BwRQeygk%2FSbl%2Bg%2Fz9y8wWyZpZ2jeUOw6kXEURYdAg%2BZMEfpNH6Q%3D%3D'; /* Service Key*/
  fcstQueryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
  fcstQueryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000');
  fcstQueryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON');
  fcstQueryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(date);
  fcstQueryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('0200');
  fcstQueryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('60');
  fcstQueryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127');

  const wrnUrl = 'http://apis.data.go.kr/1360000/WthrWrnInfoService/getPwnCd';
  let wrnQueryParams = '?' + encodeURIComponent('serviceKey') + '=vIpsf9%2FsPoI5izpvvyzFGPI7SPyElJCB43d%2BwRQeygk%2FSbl%2Bg%2Fz9y8wWyZpZ2jeUOw6kXEURYdAg%2BZMEfpNH6Q%3D%3D'; /* Service Key*/
  wrnQueryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
  wrnQueryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
  wrnQueryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON');
  wrnQueryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent('L1100400');

  const sunData = (await axios.get(sunUrl + sunQueryParams)).data.response.body.items.item;
  const fcstData = (await axios.get(fcstUrl + fcstQueryParams)).data.response.body.items.item;
  const wrnRes = (await axios.get(wrnUrl + wrnQueryParams)).data.response;

  const wrnArr = [8, 5, 7, 2, 3, 12, 1, 6, 9, 4]
  let wrnCode = null

  if (wrnRes.header.resultCode != '03') {
    const wrnData = wrnRes.body.items.item;

    const indexArr = wrnData.map((element) => {
      return wrnArr.indexOf(element.warnVar);
    })

    const minIndex = (indexArr.indexOf(Math.min(...indexArr)));
    wrnCode = wrnData[indexArr[minIndex]].warnVar;
  }

  const fcstFilter = (item) => {
    const array = ["TMN", "TMX"];
    if (array.includes(item.category) && item.fcstDate == date) {
      return true;
    }
    return false;
  };

  const filteredFcst = fcstData.filter(fcstFilter);

  const dailyForecastDTO: DailyForecastDTO = {
    date: date,
    sunrise: sunData['sunrise'].trim(),
    sunset: sunData['sunset'].trim(),
    minTemp: filteredFcst[0]['fcstValue'],
    maxTemp: filteredFcst[1]['fcstValue'],
    warning: wrnCode,
  };

  const data = await prisma.daily_forecast.create({
    data: {
      date: dailyForecastDTO.date,
      sunset: dailyForecastDTO.sunset,
      sunrise: dailyForecastDTO.sunrise,
      min_temp: +dailyForecastDTO.minTemp,
      max_temp: +dailyForecastDTO.maxTemp,
      warning: dailyForecastDTO.warning,
    },
  });

  return data;
};

const updateDailyForecast = async () => {
  const date = moment().format("YYYYMMDD");
  const time = moment().format("YYYYMMDDHH");

  let queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  queryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
  queryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("100");
  queryParams +=
    "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("JSON");
  queryParams +=
    "&" + encodeURIComponent("areaNo") + "=" + encodeURIComponent(1100000000);
  queryParams +=
    "&" + encodeURIComponent("time") + "=" + encodeURIComponent(time);
  
  const freezeUrl = "http://apis.data.go.kr/1360000/LivingWthrIdxServiceV3/getFreezeIdxV3"
  const uvUrl = "http://apis.data.go.kr/1360000/LivingWthrIdxServiceV3/getUVIdxV3"
  const airUrl = "http://apis.data.go.kr/1360000/LivingWthrIdxServiceV3/getAirDiffusionIdxV3"

  const uvData = (await axios.get(uvUrl + queryParams)).data.response.body.items.item;  
  if (uvData[0]['h1']>5) {
    let living_grade;
    
    if (uvData[0]['h1']<8) {
      living_grade = 3;
    } else {
      living_grade = 4;
    }

    const uvResult = await prisma.daily_forecast.updateMany({
      where: {
        date: date,
      },
      data: {
        living: 1,
        living_grade: living_grade,
      },
    })

    return uvResult;
  }

  const freezeData = (await axios.get(freezeUrl + queryParams)).data.response.body.items.item;  
  if (freezeData[0]['h1']>24 && freezeData[0]['h1']<100){
    const freezeResult = await prisma.daily_forecast.updateMany({
      where: {
        date: date,
      },
      data: {
        living: 2,
        living_grade: 2,
      },
    })
    return freezeResult;
  }

  //* sky코드도 확인
  const airData = (await axios.get(airUrl + queryParams)).data.response.body.items.item;
  if (airData[0]['h3'] == 25){
    const airResult = await prisma.daily_forecast.updateMany({
      where: {
        date: date,
      },
      data: {
        living: 3,
        living_grade: 4,
      },
    });
    return airResult;
  } 
}

const createHourlyForecast = async () => {
  const date = moment().format("YYYYMMDD");

  const fcstUrl =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  let fcstQueryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    `${process.env.SHORT_TERM_FORECAST_KEY}`; /* Service Key*/
  fcstQueryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
  fcstQueryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("289");
  fcstQueryParams +=
    "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("JSON");
  fcstQueryParams +=
    "&" + encodeURIComponent("base_date") + "=" + encodeURIComponent(date);
  fcstQueryParams +=
    "&" + encodeURIComponent("base_time") + "=" + encodeURIComponent("0200");
  fcstQueryParams +=
    "&" + encodeURIComponent("nx") + "=" + encodeURIComponent("60");
  fcstQueryParams +=
    "&" + encodeURIComponent("ny") + "=" + encodeURIComponent("127");

  const fcstData = (await axios.get(fcstUrl + fcstQueryParams)).data.response
    .body.items.item;

  // 기온, 강수 가져오기
  const fcstFilter = (item) => {
    const array = ["TMP", "POP", "SKY", "PTY"];
    if (array.includes(item.category)) {
      return true;
    }
    return false;
  };
  //객체형태로 저장 date(key값)
  const filteredFcst = fcstData.filter(fcstFilter);
  console.log(filteredFcst);

  const arr = [];
  for (let i = 0; i < filteredFcst.length; i += 4) {
    const data = {
      date: filteredFcst[i].fcstDate,
      time: filteredFcst[i].fcstTime,
      temperature: +filteredFcst[i].fcstValue,
      sky: +filteredFcst[i + 1].fcstValue,
      pty: +filteredFcst[i + 2].fcstValue,
      rain: +filteredFcst[i + 3].fcstValue,
    };
    const d = await prisma.hourly_forecast.create({
      data,
    });
    arr.push(d);
  }

  return arr;
};

const observedService = {
  createObserved,
  createDailyForecast,
  createHourlyForecast,
  updateDailyForecast,
};

export default observedService;
