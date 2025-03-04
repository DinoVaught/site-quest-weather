import {Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {CurrentWeatherData, HourlyWeatherData} from '../models/weather-data.models';

export const weatherData: CurrentWeatherData = {
    cityState: '',
    tempFahrenheit: -200,
    iconURL: '',
    wind: '',
    forecastCurrent: '',
    stationName: '',
    time: '',
}

export let hourlyWeatherData: HourlyWeatherData[] = [];


@Injectable({ providedIn: 'root' })

export class ApiService {
    private latitude: string = '';
    private longitude: string = '';
    private observeStation1 = '';
    // private observeStation2 = '';

    private forecastUrl = '';
    private forecastHourlyUrl = '';

    private currentConditionsUrl = '';



    constructor(private http: HttpClient) {
    }

    async initService(): Promise <CurrentWeatherData> {
         await this.getLocation();
         await this.getInitData();
         await this.getData1();
         await this.getImmediateForecast();
         await this.getCurrentWeather();
         await this.getHourlyForecast();

        return weatherData;
    }


    getLocation(): Promise<void> {

        if (this.latitude != '' || this.longitude != '') {
            // console.log(`Exiting getLocation() -   ${this.latitude}, ${this.longitude}`);
            return Promise.resolve();
        }



        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {

                        this.longitude = position.coords.longitude.toFixed(5);
                        this.latitude = position.coords.latitude.toFixed(5);
                        resolve();
                    },
                    error => {
                        // console.error('Error fetching geolocation:', error);
                        if (error.code === 1 && location.protocol !== 'https:') {
                            this.longitude = '-90.36544133993543';
                            this.latitude = '38.750082483267974';
                            console.warn('Using default location due to insecure origin.');
                            alert('Location services unavailable.' + '\n\n' +  'Using default location (St. Louis Lambert International Airport)');
                            resolve(); // Resolve with default values
                            return;
                        }
                        reject(error); // Reject the promise
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                reject('Geolocation not supported');
            }
        });
    }

    async getInitData(): Promise<void> {

        if (this.observeStation1 != '' || this.forecastUrl != '' || this.forecastHourlyUrl != '' || weatherData.cityState != '' ) {
            // console.log(`Exiting getInitData() -   ${this.observeStation1}, ${this.forecastUrl}  ${this.forecastHourlyUrl}, ${weatherData.cityState} `);
            return Promise.resolve();
        }

        const url = `https://api.weather.gov/points/${this.latitude},${this.longitude}`;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));

            weatherData.cityState = `${JSON.properties.relativeLocation.properties.city}, ${JSON.properties.relativeLocation.properties.state}`;

            console.log(`url: ${url} `);
            // console.log(`this.observeStation1.length: ${this.observeStation1} `);
            // console.log(`this.forecastUrl.length: ${this.forecastUrl} `);

            this.observeStation1 = JSON.properties.observationStations;

            this.forecastUrl = JSON.properties.forecast;

            this.forecastHourlyUrl = JSON.properties.forecastHourly;


        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getData1(): Promise<void> {

        if (this.currentConditionsUrl != '' || weatherData.stationName != '' ) {
            // console.log(`Exiting getData1() -   (${this.currentConditionsUrl}), (${weatherData.stationName} )`);
            return Promise.resolve();

        }

        const url = this.observeStation1;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));

            this.currentConditionsUrl = JSON.observationStations[0] + '/observations/latest';

            weatherData.stationName = JSON.features[0].properties.name; // [0] match with earlier array element num !!


        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getImmediateForecast(): Promise<void> {
        const url = this.forecastUrl ;

        console.log(`*** url: ${url} `);

        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));

            weatherData.wind = 'Wind: ' + JSON.properties.periods[0].windDirection + ' ' + JSON.properties.periods[0].windSpeed;
            weatherData.forecastCurrent =  JSON.properties.periods[0].name + ': ' +  JSON.properties.periods[0].detailedForecast;

        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getCurrentWeather(): Promise<void> {


        const url = this.currentConditionsUrl;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));


            weatherData.iconURL = JSON.properties.icon;

            const datePipe = new DatePipe('en-US')
            const timestamp = JSON.properties.timestamp;
            weatherData.time = datePipe.transform(timestamp, 'EEE h:mm a')  || 'Invalid date';

            weatherData.tempFahrenheit = JSON.properties.temperature.value;

            if (JSON.properties.temperature.unitCode === 'wmoUnit:degC')
            {
                weatherData.tempFahrenheit = (weatherData.tempFahrenheit * 9) / 5 + 32;
                weatherData.tempFahrenheit = Math.round(weatherData.tempFahrenheit);
            }

        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getHourlyForecast(): Promise<void> {

        const url = this.forecastHourlyUrl ;
        let targetElement = 0;
        try {

            hourlyWeatherData = [];

            const JSON = await lastValueFrom(this.http.get<any>(url));

            for (let i = 0; i < JSON.properties.periods.length; i++) {

                const apiTime = new Date(JSON.properties.periods[i].startTime);

                const sysTime = new Date();
                const currentMins = sysTime.getMinutes();

                // console.log(`1:  apiTime: (${apiTime.toLocaleString()})  - sysTime: (${sysTime.toLocaleString()})`);

                if (currentMins < 30) {
                    sysTime.setMinutes(0, 0, 0); // round hour down
                } else {
                    sysTime.setHours(sysTime.getHours() + 1, 0, 0, 0);  // round hour up
                }

                if (apiTime > sysTime) {
                    targetElement = i;
                    break;
                }
            }

            const hourlyPeriods = JSON.properties.periods.slice(targetElement, targetElement + 8);


            for (let i = 0; i < hourlyPeriods.length; i++) {

                // if (i < 4) {
                //     console.log(`hourlyPeriods[${i}].startTime.toString(): ${hourlyPeriods[i].startTime.toString()}`);
                // }

                const hourItem: HourlyWeatherData = {
                    time: hourlyPeriods[i].startTime.toString(),
                    temp: hourlyPeriods[i].temperature   + '°' + hourlyPeriods[i].temperatureUnit,
                    iconURL: hourlyPeriods[i].icon,
                    wind: hourlyPeriods[i].windSpeed + ' ' + hourlyPeriods[i].windDirection,
                    shortForecast: hourlyPeriods[i].shortForecast,
                };
                hourlyWeatherData.push(hourItem)
            }

            // console.log(` next10Periods:  {hourlyPeriods}` );

        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

     getHourlyWeatherData(): HourlyWeatherData[] {
        return hourlyWeatherData;
     }


}
