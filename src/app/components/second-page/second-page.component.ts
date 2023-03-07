import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { shareReplayOneRefBuff } from 'src/app/utils/share-replay-one-ref-buffer';
import { Subject, takeUntil, tap } from 'rxjs';

interface PaymentForm {
    payments: FormArray<FormGroup<CardInfoForm>>;
}

interface CardInfoForm {
    cardType: FormControl<string | null>;
    cardNumber: FormControl<string | null>;
}

@Component({
    selector: 'app-second-page',
    templateUrl: './second-page.component.html',
    styleUrls: ['./second-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondPageComponent implements OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public readonly defaultParams: PaymentForm = {
        payments: this.fb.array([
            this.fb.group<CardInfoForm>({
                cardType: new FormControl(null),
                cardNumber: new FormControl(null),
            }),
        ]),
    };

    public paymentForm = this.fb.group<PaymentForm>(this.defaultParams);

    public get payments(): FormArray<FormGroup<CardInfoForm>> | null {
        return this.paymentForm.get('payments') as FormArray<FormGroup<CardInfoForm>>;
    }

    public readonly formUrlParamsObservable = this.formUrlSettings.formUrlParamsChangesObservable
        .pipe(
            shareReplayOneRefBuff(),
            takeUntil(this.destroySubject),
        );

    constructor(
        private readonly formUrlSettings: FormUrlSettingsService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
    ) {}

    public ngOnDestroy(): void {
        this.destroySubject.next(true);
    }

    public async reset() {
        this.paymentForm.reset();
        await this.router.navigate([], { relativeTo: this.route });
    }

    public addNewPayment() {
        this.payments?.push(this.fb.group<CardInfoForm>({
            cardType: new FormControl(null),
            cardNumber: new FormControl(null),
        }));
    }

    public removePayment(idx: number) {
        this.payments?.removeAt(idx);
    }

}
