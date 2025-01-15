import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'; //
import {ApiService} from '../../services/api.service';
import { CurrentWeatherData } from '../../models/weather-data.model'



@Component({
    selector: 'app-weather-widget',
    templateUrl: './weather-widget.component.html',
    styleUrl: './weather-widget.component.css',
    standalone: true,
    imports: [CommonModule]
})


export class WeatherWidgetComponent implements OnInit {
    weatherData: CurrentWeatherData | null = null;

    constructor(private apiService: ApiService) {
    }

    async ngOnInit(): Promise<void> {

        this.weatherData = await this.apiService.initService();
        console.log('');

    }
}
