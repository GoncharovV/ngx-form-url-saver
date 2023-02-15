import { ActivatedRoute, Params, Router } from '@angular/router';
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
 * @property {DateTime} `useDateTime` - использовать дату. По умолчанию `false`.
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

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,

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
        if (this.strategy === 'united') {
            this.fillFormFromUnitedQuery();
        } else {
            this.fillFormFromSeparatedQuery();
        }


        this.subscribeToFormValueChanges();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        this.filtersChangesSubscription?.unsubscribe();

        this.clearFormQuery();
    }

    // #endregion

    // #region Заполнение формы из query-параметров при инициализации

    private fillFormFromUnitedQuery() {
        try {
            const query = this.activatedRoute.snapshot.queryParams[this.queryKey] as string;

            if (!query) {
                return;
            }

            // TODO: Стратегия парсинга объекта
            const formValue = JSON.parse(query);

            this.form.patchValue({
                ...formValue,
            });
        } catch { }
    }

    private fillFormFromSeparatedQuery() {
        try {
            const queryParams = this.activatedRoute.snapshot.queryParams;

            const queryObject = this.readAllSeparatedQuery(queryParams)

            this.form.patchValue({
                ...queryObject,
            });
        } catch { }
    }

    private readAllSeparatedQuery(queryParams: Params) {
        const queryObject: Record<string, unknown> = {};

        for (const key of Object.keys(this.form.value)) {
            // TODO: Стратегия парсинга объекта
            queryObject[key] = JSON.parse(queryParams[key]);
        }

        return queryObject;
    }

    // #endregion

    // #region Запись query-параметров при изменение формы

    private subscribeToFormValueChanges() {
        this.filtersChangesSubscription = this.form.valueChanges.pipe(
            startWith(this.form.value),
            debounceTime(this.debounceTime),
            map((value, index) => [value, index] as const),
        ).subscribe(([value, index]) => {
            void this.router.navigate([], {
                queryParams: this.convertFormValueToQueryObject(value),
                queryParamsHandling: 'merge',
                replaceUrl: index === 0,
            });
        });
    }

    private convertFormValueToQueryObject(formValue: Record<string, unknown>) {
        // TODO: Стратегия сериализации объекта
        if (this.strategy === 'united') {
            const serializedObject = JSON.stringify(formValue);

            return {
                [this.queryKey]: serializedObject,
            };
        } else {
            const queryObject: Record<string, unknown> = {};

            for (const key of Object.keys(formValue)) {
                queryObject[key] = JSON.stringify(formValue[key]);
            }

            return queryObject;
        }
    }

    // #endregion

    private clearFormQuery() {
        setTimeout(() => {
            void this.router.navigate([], {
                queryParams: this.createClearObject(),
                queryParamsHandling: 'merge',
                replaceUrl: true,
            });
        }, 0);
    }

    private createClearObject() {
        if (this.strategy === 'united') {
            return {
                [this.queryKey]: null,
            };
        }

        const filtersObject: Record<string, null> = {};

        for (const key of Object.keys(this.form.value)) {
            filtersObject[key] = null;
        }

        return filtersObject;
    }

}
