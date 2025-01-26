// src\app\services\rss.service.ts
import { Injectable } from '@angular/core';

// @Injectable({
//                 providedIn: 'root',
//             })
// export class RssService {
//     async getRssFeed(url: string): Promise<any[]> {
//         const response = await fetch(url);
//         const data = await response.json(); // Parse JSON from the proxy
//         const parser = new DOMParser();
//
//         // Parse both feeds
//         const feed1Items = this.parseFeed(parser, data.feed1);
//         const feed2Items = this.parseFeed(parser, data.feed2);
//
//         // Combine both feeds
//         return [...feed1Items, ...feed2Items];
//     }

    // private parseFeed(parser: DOMParser, feedXml: string): any[] {
    //     const xmlDoc = parser.parseFromString(feedXml, 'application/xml');
    //     return Array.from(xmlDoc.querySelectorAll('item')).map((item) => ({
    //         title: item.querySelector('title')?.textContent || '',
    //         link: item.querySelector('link')?.textContent || '',
    //         description: item.querySelector('description')?.textContent || '',
    //     }));
    // }

    // async getRssFeed(url: string): Promise<any[]> {
    //     const response = await fetch(url);
    //     const text = await response.text();
    //
    //     const parser = new DOMParser();
    //     const xmlDoc = parser.parseFromString(text, 'application/xml');
    //
    //     const items = Array.from(xmlDoc.querySelectorAll('item')).map((item) => ({
    //         title: item.querySelector('title')?.textContent || '',
    //         link: item.querySelector('link')?.textContent || '',
    //         description: item.querySelector('description')?.textContent || '',
    //     }));
    //
    //     return items;
    // }

// }
