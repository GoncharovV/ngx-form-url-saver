/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable id-denylist */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { DateTime } from 'luxon';
import { debounceTime, map, startWith, Subscription } from 'rxjs';
import { isDate } from 'lodash';

const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormUrlSaverDirective),
};

/**
 * Директива является наследником Angular `FormGroupDirective`
 * и используется для автоматической записи значения `FormGroup` в query-параметры.
 *
 * Позволяет установить задержку (_debounce_) обновления query.
 *
 * Если поле формы является объектом, его значение будет записано в query
 * в формате строки (_JSON.stringify_), по ключу complex-`Имя поля`
 *
 * {@link https://github.com/angular/angular/blob/main/packages/forms/src/directives/reactive_directives/form_group_directive.ts Agnular FormGroupDirective}
 */
@Directive({
    selector: '[ngxFormUrlSaver]',
    providers: [formDirectiveProvider],
})
export class FormUrlSaverDirective extends FormGroupDirective implements AfterViewInit, OnDestroy {

    private readonly COMPLEX_OBJECT_PREFIX = 'complex-';

    private readonly BASE_DEBOUNCE_TIME = 500;

    @Input('ngxFormUrlSaver')
    public override form: UntypedFormGroup = null!;

    @Input()
    public debounceTime = this.BASE_DEBOUNCE_TIME;

    @Input()
    public useDateTime = false;

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

        this.clearFiltersQuery();
    }

    // #endregion

    // #region Заполнение формы из query-параметров при инициализации

    private fillFormFromQuery() {
        const queryParams = this.activatedRoute.snapshot.queryParams;

        const simpleQuery = this.readAllSimpleQuery(queryParams);

        const complexQuery = this.readAllComplexQuery(queryParams);

        this.form.patchValue({
            ...simpleQuery,
            ...complexQuery,
        });
    }

    private readAllSimpleQuery(queryParams: Params) {
        const simpleQueryObject: Record<string, unknown> = {};

        for (const key of Object.keys(this.form.value)) {
            const value: unknown = this.getNewValueByQueryKey(queryParams, key);
            if (this.useDateTime && typeof value === 'string') {
                const dateTimeValue = DateTime.fromISO(value);
                simpleQueryObject[key] = dateTimeValue.isValid ? dateTimeValue : value;
            } else {
                simpleQueryObject[key] = value;
            }
        }

        return simpleQueryObject;
    }

    public getNewValueByQueryKey(queryParams: Params, key: string) {
        const queryParamValue: unknown = queryParams[key];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const currentValue: unknown = this.form.value[key];

        if (!queryParamValue) {
            return currentValue;
        }

        const queryValueMustBeConvertedToArray = Array.isArray(currentValue) && !Array.isArray(queryParamValue);

        return queryValueMustBeConvertedToArray
            ? [queryParamValue]
            : queryParamValue;
    }

    private readAllComplexQuery(queryParams: Params) {
        const complexQueryKeys = Object.keys(queryParams)
            .filter(paramName => this.checkIfKeyIsComplex(paramName));

        if (!complexQueryKeys.length) {
            return {};
        }

        const newFormValue: Record<string, unknown> = {};

        for (const complexKey of complexQueryKeys) {
            const originKey = this.getOriginKey(complexKey);

            try {
                newFormValue[originKey] = JSON.parse(queryParams[complexKey]);
            } catch (error: unknown) {}
        }

        return newFormValue;
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
        const queryObject: Record<string, unknown> = {};

        for (const key of Object.keys(formValue)) {
            if (this.isObject(formValue[key]) && !DateTime.isDateTime(formValue[key])) {
                queryObject[this.createComplexKey(key)] = JSON.stringify(formValue[key]);
            } else {
                queryObject[key] = this.prepareValue(formValue[key]);
            }
        }

        return queryObject;
    }

    private prepareValue(value: unknown) {
        if (isDate(value) || DateTime.isDateTime(value)) {
            return value.toJSON();
        }

        return value;
    }

    // #endregion

    // #region Работа со сложными ключами для вложенных объектов

    private createComplexKey(objectKey: string) {
        return this.COMPLEX_OBJECT_PREFIX + objectKey;
    }

    private getOriginKey(complexKey: string) {
        return complexKey.replace(this.COMPLEX_OBJECT_PREFIX, '');
    }

    private checkIfKeyIsComplex(key: string) {
        return key.includes(this.COMPLEX_OBJECT_PREFIX);
    }

    // #endregion

    /**
     * Проверяет, является ли переданное значение объектом.
     * Вернет `false` для `даты` или `массива`.
     *
     * `Object.prototype.toString.call(new Date()) = [object Date]`
     * `Object.prototype.toString.call(new Array()) = [object Array]`
     */
    private isObject(value: unknown): value is object {
        return Object.prototype.toString.call(value) === '[object Object]';
    }


    private clearFiltersQuery() {
        const filtersObject: Record<string, null> = {};

        for (const key of Object.keys(this.form.value)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (this.isObject(this.form.value[key])) {
                filtersObject[this.createComplexKey(key)] = null;
            } else {
                filtersObject[key] = null;
            }
        }

        setTimeout(() => {
            void this.router.navigate([], {
                queryParams: {
                    ...filtersObject,
                },
                queryParamsHandling: 'merge',
                replaceUrl: true,
            });
        }, 0);
    }

}
