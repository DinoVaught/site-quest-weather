import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {WeatherData} from '../models/weather-data.model';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private observationStationsUrl: string | null = null;
    private forecastHourlyUrl: string | null = null;
    private currentConditionsUrl: string | null = null;


    constructor(private http: HttpClient) {
    }

    getWeatherData(): Observable<WeatherData> {
        return this.getGeolocation().pipe(
            switchMap(({latitude, longitude}) =>
                this.getCityState(latitude, longitude)
            )
        );
    }

    getGeolocation(): Observable<{ latitude: number; longitude: number }> {
        return new Observable((observer) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        observer.next({latitude, longitude});
                        observer.complete();
                    },
                    (error) => {
                        observer.error(error);
                    }
                );
            } else {
                observer.error('Geolocation is not supported by this browser.');
            }
        });
    }

    private getCityState(latitude: number, longitude: number): Observable<WeatherData> {
        const url = `https://api.weather.gov/points/${latitude},${longitude}`;
        return this.http.get<any>(url).pipe(
            switchMap((response) => {
                const properties = response.properties;
                const relativeLocation = properties.relativeLocation?.properties;

                if (!relativeLocation) {
                    throw new Error('Relative location data is missing in the response');
                }

                const weatherData: WeatherData = {
                    city: relativeLocation.city,
                    state: relativeLocation.state,
                    stationName: '',
                };

                this.observationStationsUrl = properties.observationStations;
                this.forecastHourlyUrl = properties.forecastHourly;

                console.log(`properties.forecastHourly:  ${ properties.forecastHourly } ` );
                console.log(`properties.observationStations:  ${ properties.observationStations } ` );

                return this.getStationName(properties.observationStations).pipe(
                    map((stationName) => {
                        weatherData.stationName = stationName;
                        return weatherData;
                    })
                );


            })
        );
    }

    private getStationName(stationsUrl: string): Observable<string> {

        // console.log(`stationsUrl: ${ stationsUrl }`);

        return this.http.get<any>(stationsUrl).pipe(
            map((response) => {
                const firstStation = response.features[0];

                if (!firstStation) {
                    throw new Error('No stations found in the response');
                }


                const currentURL = response.features["0"].id;
                if (!currentURL) {
                    throw new Error('Station ID is missing in the response');
                }
                this.currentConditionsUrl = currentURL + '/observations/latest';

                // ******************* Start Here Dino 2025_01_13
                console.log(`response.features["0"].id: ${ response.features["0"].id }`);
                console.log(`this.currentConditionsUrl: ${ this.currentConditionsUrl } ` );

                return firstStation.properties.name; // = St. Louis Lambert International Airport
            })
        );
    }
}
