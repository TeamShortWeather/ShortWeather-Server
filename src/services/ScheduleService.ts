import { HourlyForecastDTO } from "./../DTO/ScheduleDTO";
import { PrismaClient } from "@prisma/client";
import { DailyForecastDTO } from "../DTO/ScheduleDTO";
const prisma = new PrismaClient();
import axios from "axios";
// import dayjs from "dayjs";
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
moment.suppressDeprecationWarnings = true;

interface Weather {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: number;
  ny: number;
  obsrValue: number;
}

//* 현황 조회
const createObserved = async () => {
  let now = moment();
  if (now.get("m") < 40) {
    if (now.get("h") == 0) {
      now = now.set("h", 23);
      now = now.add(-1, "day");
    } else now = now.add(-1, "h");
  }
  const time = now.format("HH00");
  const date = now.format("YYYYMMDD");

  const ultraSrtNcstUrl =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
  let queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  queryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
  queryParams +=
    "&" +
    encodeURIComponent("numOfRows") +
    "=" +
    encodeURIComponent("1000"); /* */
  queryParams +=
    "&" +
    encodeURIComponent("dataType") +
    "=" +
    encodeURIComponent("JSON"); /* */
  queryParams +=
    "&" +
    encodeURIComponent("base_date") +
    "=" +
    encodeURIComponent(date); /* */
  queryParams +=
    "&" +
    encodeURIComponent("base_time") +
    "=" +
    encodeURIComponent(time); /* */
  queryParams +=
    "&" + encodeURIComponent("nx") + "=" + encodeURIComponent("55"); /* */
  queryParams +=
    "&" + encodeURIComponent("ny") + "=" + encodeURIComponent("127"); /* */

  const dustUrl =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";
  let dustQueryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  dustQueryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /* */
  dustQueryParams +=
    "&" +
    encodeURIComponent("numOfRows") +
    "=" +
    encodeURIComponent("1000"); /* */
  dustQueryParams +=
    "&" +
    encodeURIComponent("returnType") +
    "=" +
    encodeURIComponent("JSON"); /* */
  dustQueryParams +=
    "&" +
    encodeURIComponent("stationName") +
    "=" +
    encodeURIComponent("중구"); /* */
  dustQueryParams +=
    "&" +
    encodeURIComponent("dataTerm") +
    "=" +
    encodeURIComponent("DAILY"); /* */
  dustQueryParams +=
    "&" + encodeURIComponent("ver") + "=" + encodeURIComponent("1.3"); /* */

  function filter(item: Weather) {
    //* REH - 습도, RN1 - 강수, T1H - 기온
    const array = ["T1H", "RN1", "REH"];
    if (array.includes(item.category)) {
      return true;
    }
    return false;
  }

  let ultraSrtNcst;
  let dust;

  await axios
    .all([
      axios.get(ultraSrtNcstUrl + queryParams),
      axios.get(dustUrl + dustQueryParams),
    ])
    .then(
      axios.spread((ncstResult, dustResult) => {
        const ncstJson = ncstResult.data.response.body.items.item;
        const filtered = ncstJson.filter(filter);
        const value = filtered.map((element: Weather) => {
          return { category: element.category, obsrValue: element.obsrValue };
        });
        ultraSrtNcst = value;

        const dustJson = dustResult.data.response.body.items;
        dust = { pm25: dustJson[0].pm25Grade1h, pm10: dustJson[0].pm10Grade1h };
      })
    )
    .catch((err) => console.log(err));

  if (ultraSrtNcst == undefined || dust == undefined) return null;

  const realTime = moment().format("HH:00");
  const realDate = moment().format("YYYYMMDD");
  const data = {
    date: realDate,
    time: realTime,
    temperature: Math.floor(+ultraSrtNcst[2].obsrValue),
    humidity: +ultraSrtNcst[0].obsrValue,
    pm25: +dust.pm25,
    pm10: +dust.pm10,
    rain: +ultraSrtNcst[1].obsrValue,
  };

  const result = await prisma.observed_weather.create({ data });
  console.log("result", result);

  return result;
};

const createDailyForecast = async () => {
  const date = moment().format("YYYYMMDD");

  const sunUrl =
    "http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo";
  let sunQueryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  sunQueryParams +=
    "&" + encodeURIComponent("locdate") + "=" + encodeURIComponent(date);
  sunQueryParams +=
    "&" + encodeURIComponent("location") + "=" + encodeURIComponent("서울");

  const fcstUrl =
    "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
  let fcstQueryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  fcstQueryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
  fcstQueryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("1000");
  fcstQueryParams +=
    "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("JSON");
  fcstQueryParams +=
    "&" + encodeURIComponent("base_date") + "=" + encodeURIComponent(date);
  fcstQueryParams +=
    "&" + encodeURIComponent("base_time") + "=" + encodeURIComponent("0200");
  fcstQueryParams +=
    "&" + encodeURIComponent("nx") + "=" + encodeURIComponent("55");
  fcstQueryParams +=
    "&" + encodeURIComponent("ny") + "=" + encodeURIComponent("127");

  const wrnUrl = "http://apis.data.go.kr/1360000/WthrWrnInfoService/getPwnCd";
  let wrnQueryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  wrnQueryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
  wrnQueryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10");
  wrnQueryParams +=
    "&" + encodeURIComponent("dataType") + "=" + encodeURIComponent("JSON");
  wrnQueryParams +=
    "&" + encodeURIComponent("areaCode") + "=" + encodeURIComponent("L1100400");

  const sunData = (await axios.get(sunUrl + sunQueryParams)).data.response.body
    .items.item;
  const fcstData = (await axios.get(fcstUrl + fcstQueryParams)).data.response
    .body.items.item;
  const wrnData = (await axios.get(wrnUrl + wrnQueryParams)).data.response;

  if (wrnData.header.resultCode != "03") {
    console.log(3456);
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
    sunrise: sunData["sunrise"].trim(),
    sunset: sunData["sunset"].trim(),
    minTemp: filteredFcst[0]["fcstValue"],
    maxTemp: filteredFcst[1]["fcstValue"],
  };

  const data = await prisma.daily_forecast.create({
    data: {
      date: dailyForecastDTO.date,
      sunset: dailyForecastDTO.sunset,
      sunrise: dailyForecastDTO.sunrise,
      min_temp: +dailyForecastDTO.minTemp,
      max_temp: +dailyForecastDTO.maxTemp,
    },
  });

  return data;
};

const createHourlyForecast = async () => {
  let now = moment();
  const date = moment().format("YYYYMMDD");
  // const time = now.moment("HH00");

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
    const array = ["TMP", "POP"];
    if (array.includes(item.category)) {
      return true;
    }
    return false;
  };
//객체형태로 저장 date(key값)
  const filteredFcst = fcstData.filter(fcstFilter);

  const arr = [filteredFcst[].baseDate]
  for(var i = 0, len = filteredFcst.length; i < len; i++){
    const arr = [filteredFcst[i].baseDate, filteredFcst[i].baseTime, filteredFcst.]

  }
  

  var filter = {};
  var keyArr = [];
  for(var i = 0, len = filteredFcst.length; i < len; i++){
    var key = keyArr[i];
    filter[key] = filteredFcst[i];
  }

  
  //array를 time 기준으로 묶고, 거기서 time, date, 날씨, 강수 빼오기


  //console.log(filteredFcst.group((time) => time));

  // const hourlyForecastDTO: HourlyForecastDTO = {
  //   date: date,
  //   time: time,
  //   temperature: fcstData[],
  //   rain: filteredFcst[1]["fcstValue"],
  // };

  // const createHourlyForecast = await prisma.hourly_forecast.createMany({
  //   data: {
  //     date: hourlyForecastDTO.date,
  //     time: hourlyForecastDTO.time,
  //     temperature: hourlyForecastDTO.temperature,
  //     rain: hourlyForecastDTO.rain,
  //   },
  // })

  // return createHourlyForecast;
};

const observedService = {
  createObserved,
  createDailyForecast,
  createHourlyForecast,
};

export default observedService;
