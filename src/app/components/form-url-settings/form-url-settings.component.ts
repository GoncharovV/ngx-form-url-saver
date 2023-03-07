import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy, TrackByFunction } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormUrlParams } from 'src/app/models/form-url-params';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-form-url-settings',
    templateUrl: './form-url-settings.component.html',
    styleUrls: ['./form-url-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUrlSettingsComponent implements OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public readonly formStrategies: string [] = ['united', 'separated'];

    public trackingStrategy: TrackByFunction<string> = idx => idx;

    public defaultParams: FormUrlParams = {
        debounceTime: this.formUrlSettings.defaultUpdateTime,
        queryKey: this.formUrlSettings.defaultQueryKey,
        strategy: this.formUrlSettings.defaultStrategy,
    };

    public formParams = this.fb.group<FormUrlParams>(this.defaultParams);

    public readonly formValueChangesSub = this.formParams.valueChanges
        .pipe(
            takeUntil(this.destroySubject),
        ).subscribe(
            params => {
                if (params.strategy) {
                    this.formUrlSettings.strategy = params.strategy;
                }

                if (params.queryKey) {
                    this.formUrlSettings.queryKey = params.queryKey;
                }

                if (params.debounceTime) {
                    this.formUrlSettings.updateTime = parseInt(`${params.debounceTime}`, 10);
                }

                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.router.navigate([], { relativeTo: this.route });
            },
        );

    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
        private readonly formUrlSettings: FormUrlSettingsService,
    ) {}

    public ngOnDestroy() {
        this.destroySubject.next(true);
    }

}
