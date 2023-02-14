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
        this.fillFormFromQuery();

        this.subscribeToFormValueChanges();
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        this.filtersChangesSubscription?.unsubscribe();

        this.clearFormQuery();
    }

    // #endregion

    // #region Заполнение формы из query-параметров при инициализации

    private fillFormFromQuery() {
        const queryParams = this.activatedRoute.snapshot.queryParams;

        const formValue = this.readFormValueFromQuery(queryParams);

        this.form.patchValue({
            ...formValue,
        });
    }

    private readFormValueFromQuery(queryParams: Params) {
        try {
            const query = queryParams[this.queryKey] as string;

            if (!query) {
                return this.form.value;
            }

            // TODO: Стратегия парсинга объекта
            return JSON.parse(query);
        } catch {
            return this.form.value;
        }
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
        const serializedObject = JSON.stringify(formValue);

        return {
            [this.queryKey]: serializedObject,
        };
    }

    // #endregion

    private clearFormQuery() {
        setTimeout(() => {
            void this.router.navigate([], {
                queryParams: {
                    [this.queryKey]: null,
                },
                queryParamsHandling: 'merge',
                replaceUrl: true,
            });
        }, 0);
    }

}
