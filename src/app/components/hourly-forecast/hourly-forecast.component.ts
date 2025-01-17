import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HourlyWeatherData } from '../models/weather-data.models';

@Component({
  selector: 'app-hourly-forecast',
  imports: [ CommonModule ],
  templateUrl: './hourly-forecast.component.html',
  styleUrl: './hourly-forecast.component.css',
  standalone: true, })


export class HourlyForecastComponent {
  @Input() time!: string;
  @Input() temp!: string;
  @Input() iconURL!: string;
  @Input() wind!: string;
  @Input() shortForecast!: string;
}
