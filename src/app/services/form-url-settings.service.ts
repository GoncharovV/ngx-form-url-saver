import { BehaviorSubject, Observable } from 'rxjs';
import { FormUrlParams } from '../models/form-url-params';
import { Injectable } from '@angular/core';
import { shareReplayOneRefBuff } from '../utils/share-replay-one-ref-buffer';

@Injectable({
    providedIn: 'root',
})
export class FormUrlSettingsService {

    private readonly DEFAULT_UPDATE_TIME = 500;

    private readonly DEFAULT_STRATEGY = 'united';

    private readonly DEFAULT_QUERY_KEY = 'form';

    private readonly formUrlParamsBehaviorSubject = new BehaviorSubject <FormUrlParams>({
        debounceTime: this.DEFAULT_UPDATE_TIME,
        queryKey: this.DEFAULT_QUERY_KEY,
        strategy: this.DEFAULT_STRATEGY,
    });

    public readonly formUrlParamsChangesObservable = (this.formUrlParamsBehaviorSubject as Observable<FormUrlParams>)
        .pipe(
            shareReplayOneRefBuff(),
        );

    public get params(): FormUrlParams {
        return this.formUrlParamsBehaviorSubject.value;
    }

    public set params(params: FormUrlParams) {
        this.formUrlParamsBehaviorSubject.next(params);
    }

    // #region params

    public get updateTime(): number {
        return this.params.debounceTime;
    }

    public set updateTime(time: number) {
        const oldParams = this.formUrlParamsBehaviorSubject.value;

        this.formUrlParamsBehaviorSubject.next({
            ...oldParams,
            debounceTime: time,
        });
    }

    public get strategy(): 'separated' | 'united' {
        return this.params.strategy;
    }

    public set strategy(strategy: 'separated' | 'united') {
        const oldParams = this.formUrlParamsBehaviorSubject.value;

        this.formUrlParamsBehaviorSubject.next({
            ...oldParams,
            strategy,
        });
    }

    public get queryKey(): string {
        return this.params.queryKey;
    }

    public set queryKey(key: string) {
        const oldParams = this.formUrlParamsBehaviorSubject.value;

        this.formUrlParamsBehaviorSubject.next({
            ...oldParams,
            queryKey: key,
        });
    }

    // #endregion params

    // #region default-params

    public get defaultUpdateTime(): number {
        return this.DEFAULT_UPDATE_TIME;
    }

    public get defaultQueryKey(): string {
        return this.DEFAULT_QUERY_KEY;
    }

    public get defaultStrategy(): 'separated' | 'united' {
        return this.DEFAULT_STRATEGY;
    }

    // #endregion default-params

}
