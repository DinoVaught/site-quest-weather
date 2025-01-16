export interface CurrentWeatherData {
    cityState: string;
    tempFahrenheit: number;
    iconURL: string;
    wind: string;
    forecastCurrent: string;
    stationName: string;
    time: string;
}

export interface HourlyWeatherData {
    time: string;
    temp: string;
    iconURL: string;
    wind: string;
    shortForecast: string;
}

// export interface HourlyWeather {
//     data: HourlyWeatherData[];
// }