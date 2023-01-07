import { PrismaClient } from "@prisma/client";
import { DailyForecastDTO } from '../DTO/ScheduleDTO';
import axios from "axios";
import dayjs from "dayjs";

const prisma = new PrismaClient();

interface Weather {
  baseDate: string,
  baseTime: string,
  category: string,
  nx: number,
  ny: number,
  obsrValue: number
};

//* 현황 조회
const createObserved = async () => {
  let now = dayjs();
  if (now.get('m') < 40) {
    if (now.get('h') == 0) {
      now = now.set('h', 23);
      now = now.add(-1, 'day');
    }
    else
      now = now.add(-1, 'h');
  };
  const time = now.format("HH00");
  const date = now.format("YYYYMMDD");

  const ultraSrtNcstUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
  queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
  queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(date); /* */
  queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(time); /* */
  queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); /* */
  queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); /* */

  const dustUrl = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty';
  let dustQueryParams = '?' + encodeURIComponent('serviceKey') + '=' + `${process.env.WEATHER_SERVICE_KEY}`; /* Service Key*/
  dustQueryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
  dustQueryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
  dustQueryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('JSON'); /* */
  dustQueryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent('중구'); /* */
  dustQueryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /* */
  dustQueryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.3'); /* */

  function filter(item: Weather) {
    //* REH - 습도, RN1 - 강수, T1H - 기온
    const array = ['T1H', 'RN1', 'REH']
    if (array.includes(item.category)) {
      return true;
    }
    return false;
  }

  let ultraSrtNcst;
  let dust;

  await axios.all([axios.get(ultraSrtNcstUrl + queryParams), axios.get(dustUrl + dustQueryParams)])
    .then(axios.spread((ncstResult, dustResult) => {
      const ncstJson = ncstResult.data.response.body.items.item;
      const filtered = ncstJson.filter(filter);
      const value = filtered.map((element: Weather) => {
        return { category: element.category, obsrValue: element.obsrValue };
      });
      ultraSrtNcst = value;

      const dustJson = dustResult.data.response.body.items;
      dust = { pm25: dustJson[0].pm25Grade1h, pm10: dustJson[0].pm10Grade1h };
    }))
    .catch((err) => console.log(err));

  if (ultraSrtNcst == undefined || dust == undefined) return null;

  const realTime = dayjs().format("HH:00");
  const realDate = dayjs().format("YYYYMMDD");
  const data = {
    date: realDate,
    time: realTime,
    temperature: Math.floor(+ultraSrtNcst[2].obsrValue),
    humidity: +ultraSrtNcst[0].obsrValue,
    pm25: +dust.pm25,
    pm10: +dust.pm10,
    rain: +ultraSrtNcst[1].obsrValue
  };

  const result = await prisma.observed_weather.create({ data });
  console.log('result', result);

  return result;
};

const createDailyForecast = async () => {
  const date = dayjs().format("YYYYMMDD");

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
  fcstQueryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('55'); 
  fcstQueryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); 

  const wrnUrl = 'http://apis.data.go.kr/1360000/WthrWrnInfoService/getPwnCd';
  let wrnQueryParams = '?' + encodeURIComponent('serviceKey') + '=vIpsf9%2FsPoI5izpvvyzFGPI7SPyElJCB43d%2BwRQeygk%2FSbl%2Bg%2Fz9y8wWyZpZ2jeUOw6kXEURYdAg%2BZMEfpNH6Q%3D%3D'; /* Service Key*/
  wrnQueryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); 
  wrnQueryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
  wrnQueryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); 
  wrnQueryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent('L1021600'); 

  const sunData = (await axios.get(sunUrl+sunQueryParams)).data.response.body.items.item;
  const fcstData = (await axios.get(fcstUrl+fcstQueryParams)).data.response.body.items.item;
  const wrnRes = (await axios.get(wrnUrl+wrnQueryParams)).data.response;

  const wrnArr = [8, 5, 7, 2, 3, 12, 1, 6, 9, 4]
  let wrnCode = null

  if (wrnRes.header.resultCode!='03') {
      const wrnData = wrnRes.body.items.item;

      const indexArr = wrnData.map((element) => {
          return wrnArr.indexOf(element.warnVar);
      })

      const minIndex = (indexArr.indexOf(Math.min(...indexArr)));
      wrnCode = wrnData[indexArr[minIndex]].warnVar;
  }
  
  const fcstFilter = (item) => {
    const array = ['TMN', 'TMX']
    if (array.includes(item.category) && item.fcstDate==date) {
      return true;
    }
    return false;
  }        

  const filteredFcst = fcstData.filter(fcstFilter);

  const dailyForecastDTO: DailyForecastDTO = {
    date: date,
    sunrise: sunData['sunrise'].trim(),
    sunset: sunData['sunset'].trim(),
    minTemp: filteredFcst[0]['fcstValue'], 
    maxTemp: filteredFcst[1]['fcstValue'],
    warning: wrnCode,
  }
  console.log(dailyForecastDTO)

  // const data = await prisma.daily_forecast.create({
  //   data: {
  //     date: dailyForecastDTO.date,
  //     sunset: dailyForecastDTO.sunset,
  //     sunrise: dailyForecastDTO.sunrise,
  //     minTemp: +dailyForecastDTO.minTemp,
  //     maxTemp: +dailyForecastDTO.maxTemp
  //   },
  // });

  const data = 'abc';

  return data;
};

const observedService = {
  createObserved,
  createDailyForecast,
};

export default observedService;
