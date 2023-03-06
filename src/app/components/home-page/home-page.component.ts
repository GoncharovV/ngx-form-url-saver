import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { shareReplayOneRefBuff } from 'src/app/utils/share-replay-one-ref-buffer';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public readonly defaultParams = {
        firstName: new FormControl(''),
        secondName: new FormControl(''),
        age: new FormControl(0),
        email: new FormControl(''),
        phone: new FormControl(null),
        country: new FormControl(''),
        city: new FormControl(''),
        birth: new FormControl(null),
    };

    public registerFormUnited = new FormGroup(this.defaultParams);

    public registerFormSeparated = new FormGroup(this.defaultParams);

    public readonly formUrlParamsObservable = this.formUrlSettings.formUrlParamsChangesObservable
        .pipe(
            tap(() => {
                this.reset();
            }),
            shareReplayOneRefBuff(),
            takeUntil(this.destroySubject),
        );

    public strategy = this.formUrlSettings.strategy;

    public queryKey = this.formUrlSettings.queryKey;

    public debounceTime = this.formUrlSettings.updateTime;

    constructor(private readonly formUrlSettings: FormUrlSettingsService) {}

    public ngOnDestroy(): void {
        this.destroySubject.next(true);
    }

    public reset(): void {
        this.registerFormUnited.patchValue({
            firstName: '',
            secondName: '',
            age: 0,
            email: '',
            phone: null,
            country: '',
            city: '',
            birth: null,
        });
        this.registerFormSeparated.reset({
            firstName: '',
            secondName: '',
            age: 0,
            email: '',
            phone: null,
            country: '',
            city: '',
            birth: null,
        });
    }

}
