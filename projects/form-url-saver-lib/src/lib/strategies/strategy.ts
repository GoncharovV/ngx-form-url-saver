import { Params } from '@angular/router';

export interface QueryGenerationStrategy {


    inferFormValueFromQuery(queryParams: Params, formValue: Record<string, unknown>): object;


    convertFormValueToQueryObject(formValue: Record<string, unknown>): object;


    createClearingObject(formValue: Record<string, unknown>): object;
}