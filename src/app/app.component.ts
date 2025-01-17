import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherWidgetComponent } from './components/weather-widget/weather-widget.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'site-quest (weather)';
}
