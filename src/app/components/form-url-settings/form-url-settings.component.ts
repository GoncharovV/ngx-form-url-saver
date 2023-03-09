import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormUrlParams } from 'src/app/models/form-url-params';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { Subject, takeUntil } from 'rxjs';

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

    public trackingStrategy: TrackByFunction<string> = idx => idx;

    public formParams = this.fb.group<FormUrlSettings<FormUrlParams>>({
        debounceTime: new FormControl(this.formUrlSettings.DEFAULT_UPDATE_TIME, { nonNullable: true }),
        queryKey: new FormControl(this.formUrlSettings.DEFAULT_QUERY_KEY, { nonNullable: true }),
        strategy: new FormControl(this.formUrlSettings.DEFAULT_STRATEGY, { nonNullable: true }),
    });


    constructor(
        private readonly fb: FormBuilder,
        private readonly formUrlSettings: FormUrlSettingsService,
    ) {}

    public ngOnInit() {
        this.formParams.valueChanges
            .pipe(
                takeUntil(this.destroySubject),
            ).subscribe(
                params => { this.formUrlSettings.patchParams(this.handleParams(params)); },
            );
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

        return handledParams;
    }

    public ngOnDestroy() {
        this.destroySubject.next(true);
    }

}
