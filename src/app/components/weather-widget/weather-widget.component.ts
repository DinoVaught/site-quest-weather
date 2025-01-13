import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import { WeatherData } from '../../models/weather-data.model'


@Component({
    selector: 'app-weather-widget',
    imports: [],
    templateUrl: './weather-widget.component.html',
    styleUrl: './weather-widget.component.css',
    standalone: true
})
export class WeatherWidgetComponent implements OnInit {
    weatherData: WeatherData | null = null;



    constructor(private apiService: ApiService) {
    }

    ngOnInit(): void {

        this.apiService.getWeatherData().subscribe({
            next: (data: WeatherData) => {
                this.weatherData = data; // Store the fetched weather data
                console.log('Weather Data:', this.weatherData); // Log the result for debugging
            },
            error: (error) => {
                console.error('Failed to fetch weather data:', error); // Log any errors
            },
        });

    }
}
