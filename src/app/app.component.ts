import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherWidgetComponent } from './components/weather-widget/weather-widget.component';
import { RssFeedComponent } from './components/rss-feed/rss-feed.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [ WeatherWidgetComponent, RssFeedComponent, CommonModule ]
})
export class AppComponent {
  title = 'Weather - News';

  showAbout = false;

  openAbout() {
    this.showAbout = true;
    document.body.classList.add('no-scroll');
  }

  closeAbout() {
    this.showAbout = false;
    document.body.classList.remove('no-scroll');
  }
}
