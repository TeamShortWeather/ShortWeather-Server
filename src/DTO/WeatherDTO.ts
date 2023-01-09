export interface TodayWeatherDTO {
    location: string;
    compareTemp: number;
    compareMessage: string;
    breakingNews: string;
    fineDust: number;
    ultrafineDust: number;
    imageTime: string;
    imageDesc: string;
    currentTemp: number;
    minTemp: number;
    maxTemp: number;
    weatherMessage: string;
};

export interface WeatherInfoDTO {
    humidity: number,
    sunset: string,
    sunrise: string,
    pm25: number,
    pm10: number,
};
