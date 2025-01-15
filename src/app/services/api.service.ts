import {Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CurrentWeatherData} from '../models/weather-data.model';
import NewCommandModule from "@angular/cli/src/commands/new/cli";


export const weatherData: CurrentWeatherData = {
    cityState: '',
    tempFahrenheit: -200,
    iconURL: '',
    wind: '',
    forecastCurrent: '',
    stationName: '',
    time: '',
}

@Injectable({ providedIn: 'root' })

export class ApiService {
    private latitude: string = '';
    private longitude: string = '';
    private observeStation1 = '';
    // private observeStation2 = '';

    private forecastUrl = '';
    private forecastHourlyUrl = '';

    private currentConditionsUrl = '';

    private cityState: string = '';


    constructor(private http: HttpClient) {
    }

    async initService(): Promise <CurrentWeatherData> {
         await this.getLocation();
         await this.getInitData();
         await this.getData1();
         await this.getImmediateForecast();
         await this.getLocalData();
         await this.getHourlyForecast();

        return weatherData;

    }


    getLocation(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {

                        this.longitude = position.coords.longitude.toFixed(4);
                        this.latitude = position.coords.latitude.toFixed(4);

                        resolve(); // Resolve the promise when done
                    },
                    error => {
                        console.error('Error fetching geolocation:', error);
                        reject(error); // Reject the promise if there's an error
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                reject('Geolocation not supported');
            }
        });
    }

    async getInitData(): Promise<void> {
        const url = `https://api.weather.gov/points/${this.latitude},${this.longitude}`;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));

            weatherData.cityState = `${JSON.properties.relativeLocation.properties.city}, ${JSON.properties.relativeLocation.properties.state}`;

            this.observeStation1 = JSON.properties.observationStations;

            this.forecastUrl = JSON.properties.forecast;

            this.forecastHourlyUrl = JSON.properties.forecastHourly;

            console.log(`this.forecastHourlyUrl:  ${this.forecastHourlyUrl}`);
            // console.log(`this.forecastUrl:  ${this.forecastUrl}`);


        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getData1(): Promise<void> {
        const url = this.observeStation1;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));

            this.currentConditionsUrl = JSON.observationStations[0] + '/observations/latest';

            weatherData.stationName = JSON.features[0].properties.name; // [0] match with earlier array element num !!
            // weatherData.temperature = '';
            // temperature

            // console.log(`this.observeStation1  url:  ${url}`); //  JSON.properties.observationStations
            // console.log(`this.currentConditionsUrl:  ${this.currentConditionsUrl}`); //  JSON.properties.observationStations


        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getImmediateForecast(): Promise<void> {
        const url = this.forecastUrl ;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));


            weatherData.wind = JSON.properties.periods[0].windDirection + ' ' + JSON.properties.periods[0].windSpeed;
            weatherData.forecastCurrent =  JSON.properties.periods[0].name + ': ' +  JSON.properties.periods[0].detailedForecast;

            // JSON.properties.periods[0].name

            // weatherData.iconURL =  JSON.properties.periods[0].icon; // I think this is the 'forecast icon' not the 'current icon '

            // console.log(`URL:  ${url}`);
            console.log(`==== url:  ${url}`);



        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getLocalData(): Promise<void> {


        const url = this.currentConditionsUrl;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));



            weatherData.iconURL = JSON.properties.icon;

            const datePipe = new DatePipe('en-US')
            const timestamp = JSON.properties.timestamp;
            weatherData.time = datePipe.transform(timestamp, 'EEE h:mm a')  || 'Invalid date';

            // console.log(`weatherData.time: ${weatherData.time}`);

            weatherData.tempFahrenheit = JSON.properties.temperature.value;

            if (JSON.properties.temperature.unitCode === 'wmoUnit:degC')
            {
                weatherData.tempFahrenheit = (weatherData.tempFahrenheit * 9) / 5 + 32;
                weatherData.tempFahrenheit = Math.round(weatherData.tempFahrenheit);
            }



            // console.log(`** !! url:  ${url}`);
            // console.log(`weatherData.temperature:  ${weatherData.tempFahrenheit}`);


        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    async getHourlyForecast(): Promise<void> {
        const url = this.forecastHourlyUrl ;
        try {
            const JSON = await lastValueFrom(this.http.get<any>(url));

            const periods = JSON.properties.periods;

            const first16Periods = periods.slice(0, 16);




            console.log(`first16Periods:  ${first16Periods}`);
            // console.log(`weatherData:  ${weatherData}`);



        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }


}
