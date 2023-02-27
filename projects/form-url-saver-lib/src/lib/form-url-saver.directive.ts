import { Separated } from './strategies/separated-form.strategy';
import { United } from './strategies/united-form.strategy';
import { QueryGenerationStrategy } from './strategies/strategy';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Directive, forwardRef, Inject, Input, OnDestroy, Optional, Self } from '@angular/core';
import {
    AsyncValidator,
    AsyncValidatorFn,
    ControlContainer,
    FormGroupDirective,
    NG_ASYNC_VALIDATORS,
    NG_VALIDATORS,
    UntypedFormGroup,
    Validator,
    ValidatorFn,
} from '@angular/forms';
import { debounceTime, map, startWith, Subscription } from 'rxjs';
import { FormHandlingStrategy, FormHandlingStrategyToken } from '../token';

const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormUrlSaverDirective),
};

/**
 * @description
 * Директива является наследником Angular `FormGroupDirective`
 * и используется для автоматической записи значения `FormGroup` в query-параметры.
 *
 * Позволяет установить задержку (_debounce_) обновления query.
 *
 * TODO: Прокомментировать принцип работы после изменения логики
 *
 * @property {number} `debounceTime` - Время задержки.
 *
 * @property {UntypedFormGroup} `form` - ссылка на форму.
 *
 * {@link https://github.com/angular/angular/blob/main/packages/forms/src/directives/reactive_directives/form_group_directive.ts Angular FormGroupDirective}
 */
@Directive({
    selector: '[ngxFormUrlSaver]',
    providers: [formDirectiveProvider],
})
export class FormUrlSaverDirective extends FormGroupDirective implements AfterViewInit, OnDestroy {

    private readonly BASE_DEBOUNCE_TIME = 500;

    @Input('ngxFormUrlSaver')
    public override form: UntypedFormGroup = null!;

    @Input()
    public debounceTime = this.BASE_DEBOUNCE_TIME;

    @Input()
    public queryKey = 'form';

    @Input()
    public strategy: 'united' | 'separated' = 'united';

    private filtersChangesSubscription?: Subscription;

    private queryStrategy!: QueryGenerationStrategy;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,

        @Inject(FormHandlingStrategyToken)
        private readonly formHandlingStrategy: FormHandlingStrategy,

        /**
         * Default Angular FormGroupDirective dependencies
         */
        @Optional() @Self() @Inject(NG_VALIDATORS)
        private readonly _validators: Array<(Validator | ValidatorFn)>,
        @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS)
        private readonly _asyncValidators: Array<(AsyncValidator | AsyncValidatorFn)>,
    ) {
        super(_validators, _asyncValidators);
    }

    // #region Lifecycle methods

    public ngAfterViewInit(): void {
        this.queryStrategy = this.createQueryHandlingStrategy();

        setTimeout(() => {
            this.fillFormFromQuery();
        })
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        this.filtersChangesSubscription?.unsubscribe();

        this.clearFormQuery();
    }

    // #endregion

    private fillFormFromQuery() {
        this.form.patchValue(
            this.queryStrategy.inferFormValueFromQuery(this.activatedRoute.snapshot.queryParams, this.form.value)
        );

        this.subscribeToFormValueChanges();
    }

    public createQueryHandlingStrategy() {
        if (this.strategy === 'united') {
            return new United(this.formHandlingStrategy, this.queryKey);
        } else {
            return new Separated(this.formHandlingStrategy);
        }
    }

    private subscribeToFormValueChanges() {
        this.filtersChangesSubscription = this.form.valueChanges.pipe(
            startWith(this.form.value),
            debounceTime(this.debounceTime),
            map((value, index) => [value, index] as const),
        ).subscribe(([value, index]) => {
            void this.router.navigate([], {
                queryParams: this.queryStrategy.convertFormValueToQueryObject(value),
                queryParamsHandling: 'merge',
                replaceUrl: index === 0,
            });
        });
    }

    private clearFormQuery() {
        setTimeout(() => {
            void this.router.navigate([], {
                queryParams: this.queryStrategy.createClearingObject(this.form.value),
                queryParamsHandling: 'merge',
                replaceUrl: true,
            });
        }, 0);
    }

}
