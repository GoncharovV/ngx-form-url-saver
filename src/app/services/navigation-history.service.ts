import { BehaviorSubject, filter, Observable, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';
import { isNavigationEnd } from '../utils/is-navigation-end';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class NavigationHistoryService {

    private readonly currentUrlBehaviorSubject = new BehaviorSubject<string | undefined>(undefined);

    public readonly currentUrlObservable = (this.currentUrlBehaviorSubject as Observable<string | undefined>)
        .pipe(shareReplay({
            refCount: true,
            bufferSize: 1,
        }));

    public get currentUrl(): string | undefined {
        return this.currentUrlBehaviorSubject.value;
    }

    public set currentUrl(url: string | undefined) {
        this.currentUrlBehaviorSubject.next(url);
    }

    constructor(private readonly router: Router) {
        this.router.events
            .pipe(
                filter(isNavigationEnd),
            )
            .subscribe(event => {
                this.currentUrl = event.url;
            });
    }

}
