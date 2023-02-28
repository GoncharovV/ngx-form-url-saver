import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, filter, shareReplay } from 'rxjs';
import { isNavigationEnd } from '../utils/is-navigation-end';

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {

    private readonly currentUrlBehaviorSubject = new BehaviorSubject<string | undefined>(undefined);

    public readonly currentUrlObservable = (this.currentUrlBehaviorSubject as Observable<string | undefined>)
        .pipe(shareReplay({
            refCount: true,
            bufferSize: 1,
        }));

    public get currentUrl() : string | undefined {
        return this.currentUrlBehaviorSubject.value;
    }

    public set currentUrl (url: string | undefined) {
        this.currentUrlBehaviorSubject.next(url);
    }

    constructor(private readonly router: Router) {
        this.router.events
        .pipe(
            filter(isNavigationEnd)
        )
        .subscribe((e) => {
            this.currentUrl = e.url;
        })
    }
}
