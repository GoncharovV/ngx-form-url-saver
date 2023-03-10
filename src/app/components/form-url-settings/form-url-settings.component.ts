import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormUrlParams } from 'src/app/models/form-url-params';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

type FormUrlSettings<T> = {
    [P in keyof T]: T[P] extends 'object' ? FormGroup<FormUrlSettings<T>> : FormControl<T[P]>;
};

@Component({
    selector: 'app-form-url-settings',
    templateUrl: './form-url-settings.component.html',
    styleUrls: ['./form-url-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUrlSettingsComponent implements OnInit, OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public readonly formStrategies: string [] = ['united', 'separated'];

    public readonly shouldReloadSubject = new Subject<boolean>();

    public trackingStrategy: TrackByFunction<string> = idx => idx;

    public formParams = this.fb.group<FormUrlSettings<FormUrlParams>>({
        debounceTime: new FormControl(this.formUrlSettings.DEFAULT_UPDATE_TIME, { nonNullable: true }),
        queryKey: new FormControl(this.formUrlSettings.DEFAULT_QUERY_KEY, { nonNullable: true }),
        strategy: new FormControl(this.formUrlSettings.DEFAULT_STRATEGY, { nonNullable: true }),
    });


    constructor(
        private readonly fb: FormBuilder,
        private readonly formUrlSettings: FormUrlSettingsService,
        private readonly router: Router,
    ) {}

    public ngOnInit() {
        this.formParams.valueChanges
            .pipe(
                map(params => this.handleParams(params)),
                tap(params => { this.formUrlSettings.patchParams(params); }),
                takeUntil(this.destroySubject),
            ).subscribe();

        this.shouldReloadSubject.asObservable().pipe(
            tap(() => this.reload()),
            takeUntil(this.destroySubject),
        )
            .subscribe();
    }

    public async reload() {
        const url = this.router.url;
        const regex = /\/\w+/gmi;

        const clearedUrl = url.slice().match(regex)
            ?.shift();

        if (clearedUrl) {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;

            await this.router.navigate([clearedUrl]);

            this.router.routeReuseStrategy.shouldReuseRoute = () => true;
        }

    }


    // eslint-disable-next-line complexity
    public handleParams(params: Partial<FormUrlParams>): Partial<FormUrlParams> {

        const handledParams: Partial<FormUrlParams> = {};

        if (params.strategy && params.strategy !== this.formUrlSettings.params.strategy) {
            handledParams.strategy = params.strategy;
        }

        if (params.queryKey && params.queryKey !== this.formUrlSettings.params.queryKey) {
            handledParams.queryKey = params.queryKey;
        }

        if (params.debounceTime) {
            const oldDebounceTime = this.formUrlSettings.params.debounceTime;

            const newDebounceTime = parseInt(`${params.debounceTime}`, 10);


            if (oldDebounceTime !== newDebounceTime) {
                handledParams.debounceTime = newDebounceTime;
            }
        }

        this.shouldReloadSubject.next(true);

        return handledParams;
    }

    public ngOnDestroy() {
        this.destroySubject.next(true);
    }

}
