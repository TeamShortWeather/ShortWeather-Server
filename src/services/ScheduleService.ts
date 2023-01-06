import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import axios from "axios";
import dayjs from "dayjs";

interface Weather {
  baseDate: string,
  baseTime: string,
  category: string,
  nx: number,
  ny: number,
  obsrValue: number
};

//* 현황 조회
const getObserved = async () => {
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

const observedService = {
  getObserved,
};

export default observedService;
