import {Component, ChangeDetectorRef, OnInit, AfterViewChecked, ElementRef, QueryList, ViewChildren} from '@angular/core';
import { CommonModule } from '@angular/common'; //
// import { ChangeDetectorRef } from '@angular/core';
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


export class WeatherWidgetComponent implements OnInit, AfterViewChecked {
    weatherData: CurrentWeatherData | null = null;
    hourlyWeather: HourlyWeatherData[] = [];
    firstRow: any[] = [];
    secondRow: any[] = [];

    isLoading = true;

    @ViewChildren('forecastItem', { read: ElementRef }) forecastItems!: QueryList<ElementRef>;

    constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    }


    // 900000); // = 15 minutes
    // 300000 =    5 min
    async ngOnInit(): Promise<void> {

        await this.fetchWeatherData();

        const fetchWeatherPeriodically = async () => {
            await this.fetchWeatherData(); // Fetch the data
            setTimeout(fetchWeatherPeriodically, 900000); // Schedule next execution
        };

        setTimeout(fetchWeatherPeriodically, 900000);


        // setInterval(() => {
        //     this.fetchWeatherData();
        // }, 300000);
    }

    ngAfterViewChecked(): void {


        if (this.forecastItems?.length > 0) {
            console.log(`Forecast items count: ${this.forecastItems?.length} `);

            let count = 0;

            let maxWidth = 0;

            this.forecastItems.forEach(item => {

                count++;
                console.log(`${count} - offsetWidth:  (${item.nativeElement.offsetWidth})`);

                const width = item.nativeElement.offsetWidth;
                if (width > maxWidth) {
                    maxWidth = width;
                }
            });


            this.syncWidths(maxWidth);
            console.log(`maxWidth:  (${maxWidth})`);

        }

        // console.log('Forecast items count:', this.forecastItems?.length || 0);
    }

    syncWidths(maxWidth: number): void {


        let count = 0;

        this.forecastItems.forEach(item => {
            if (item && item.nativeElement) {
                item.nativeElement.style.width = maxWidth + 'px';

                count++;
                console.log(`${count} - syncWidths: (${maxWidth}) `);

            }
        });

    }

    async fetchWeatherData(): Promise<void> {
        try {
            this.isLoading = true;

            this.weatherData = await this.apiService.initService();


            const newHourlyWeather = this.apiService.getHourlyWeatherData();
            this.hourlyWeather = [...newHourlyWeather];


            this.firstRow = this.hourlyWeather.slice(0, 4);
            this.secondRow = this.hourlyWeather.slice(4, 8);


        } catch (error) {
            console.error('Error fetching weather data:', error);
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }


}
