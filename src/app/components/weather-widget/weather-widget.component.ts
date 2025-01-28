import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; //
import {ApiService} from '../../services/api.service';
import { CurrentWeatherData, HourlyWeatherData  } from '../../models/weather-data.models'
import { HourlyForecastComponent  } from '../hourly-forecast/hourly-forecast.component'


@Component({
    selector: 'app-weather-widget',
    templateUrl: './weather-widget.component.html',
    styleUrls: ['./weather-widget.component.css'],
    standalone: true,
    imports: [CommonModule, HourlyForecastComponent ]
})


export class WeatherWidgetComponent implements OnInit {
    weatherData: CurrentWeatherData | null = null;
    hourlyWeather: HourlyWeatherData[] = [];
    firstRow: any[] = [];
    secondRow: any[] = [];

    isLoading = true;

    constructor(private apiService: ApiService) {
    }

    //  900000); // = 15 minutes
    async ngOnInit(): Promise<void> {

        await this.fetchWeatherData();

        setInterval(() => {
            this.fetchWeatherData();
        }, 900000); // = 15 minutes
    }

    async fetchWeatherData(): Promise<void> {
        try {
            this.isLoading = true;

            // console.log(`fetching weather data`);

            this.weatherData = await this.apiService.initService();
            this.hourlyWeather = this.apiService.getHourlyWeatherData();

            this.firstRow = this.hourlyWeather.slice(0, 4);
            this.secondRow = this.hourlyWeather.slice(4, 8);

        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            this.isLoading = false;
        }
    }


}
