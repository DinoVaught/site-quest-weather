import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment'
import { lastValueFrom } from 'rxjs';


@Component({
             standalone: true,
             selector: 'app-rss-feed',
             templateUrl: './rss-feed.component.html',
             styleUrls: ['./rss-feed.component.css'],
             imports: [CommonModule],
           })
export class RssFeedComponent implements OnInit {
    apiUrl: string = environment.backendUrl;
    rssItems: any[] = [];

    constructor(private http: HttpClient) {}


    async ngOnInit() {

        // console.log(`apiUrl = ${this.apiUrl}`);

        try {
            const feedUrl = `${this.apiUrl}foxnews`;
            const response = await lastValueFrom(this.http.get<any[]>(feedUrl));

            // console.log(response);

            this.rssItems = response?.map(item => ({
                ...item,
                description: this.decodeHtml(item.description),
                title: this.decodeHtml(item.title)
            })) ?? [];


        } catch (error) {
            console.error('Failed to load RSS feed:', error);
        }
    }
    decodeHtml(html: string): string {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.innerText || tempDiv.textContent || '';
    }


}

