import { BehaviorSubject, filter } from 'rxjs';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isNavigationEnd } from '../utils/is-navigation-end';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class NavigationHistoryService {

    private readonly codec = new HttpUrlEncodingCodec();

    private readonly currentUrlBehaviorSubject = new BehaviorSubject<string>('');

    public readonly currentUrlObservable = this.currentUrlBehaviorSubject.asObservable();

    public get currentUrl(): string {
        return this.currentUrlBehaviorSubject.value;
    }

    public set currentUrl(url: string) {
        this.currentUrlBehaviorSubject.next(url);
    }

    constructor(private readonly router: Router) {

        this.router.events
            .pipe(
                filter(isNavigationEnd),
            )
            .subscribe(event => {
                const decodedUrl = this.codec.decodeValue(event.url);

                this.currentUrl = decodedUrl;
            });
    }

}
