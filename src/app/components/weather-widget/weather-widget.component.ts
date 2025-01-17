import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; //
import {ApiService} from '../../services/api.service';
import { CurrentWeatherData, HourlyWeatherData  } from '../../models/weather-data.models'
import { HourlyForecastComponent  } from '../hourly-forecast/hourly-forecast.component'


@Component({
    selector: 'app-weather-widget',
    templateUrl: './weather-widget.component.html',
    styleUrl: './weather-widget.component.css',
    standalone: true,
    imports: [CommonModule, HourlyForecastComponent ]
})


export class WeatherWidgetComponent implements OnInit {
    weatherData: CurrentWeatherData | null = null;
    hourlyWeather: HourlyWeatherData[] = [];

    constructor(private apiService: ApiService) {
    }

    async ngOnInit(): Promise<void> {

        this.weatherData = await this.apiService.initService();
        this.hourlyWeather = this.apiService.getHourlyWeatherData();

        console.log(this.hourlyWeather);

    }
}
