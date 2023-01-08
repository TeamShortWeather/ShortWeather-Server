export interface DailyForecastDTO {
    date: string,
    sunset: string,
    sunrise: string,
    minTemp: string,
    maxTemp: string,
    warning: number,
}

export interface HourlyForecastDTO {
  date: string;
  time: string;
  temperature: number;
  rain: number;
}