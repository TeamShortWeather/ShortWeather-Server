export interface TodayWeatherDTO {
    location: string;
    compareTemp: number;
    compareMessage: string;
    breakingNews: number; //! string으로 변경예정
    fineDust: number;
    ultrafineDust: number;
    weatherImage: number;
    weatherImageDesc: string;
    currentTemp: number;
    minTemp: number;
    maxTemp: number;
    weatherMessage: string;
};
