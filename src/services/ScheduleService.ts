import { PrismaClient } from "@prisma/client";
import { DailyForecastDTO } from '../DTO/ScheduleDTO';
import dayjs from "dayjs"

const axios = require('axios')

const prisma = new PrismaClient();

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
  wrnQueryParams += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent('L1100400'); 

  const sunData = (await axios.get(sunUrl+sunQueryParams)).data.response.body.items.item;
  const fcstData = (await axios.get(fcstUrl+fcstQueryParams)).data.response.body.items.item;
  const wrnData = (await axios.get(wrnUrl+wrnQueryParams)).data.response;

  if (wrnData.header.resultCode!='03') {
      console.log(3456)
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
  }

  const data = await prisma.daily_forecast.create({
    data: {
      date: dailyForecastDTO.date,
      sunset: dailyForecastDTO.sunset,
      sunrise: dailyForecastDTO.sunrise,
      minTemp: +dailyForecastDTO.minTemp,
      maxTemp: +dailyForecastDTO.maxTemp
    },
  });

  return data;
};

export default {
  createDailyForecast,
};