import { Params } from '@angular/router';
import { FormHandlingStrategy } from '../../token';
import { QueryGenerationStrategy } from './strategy';


export class Separated implements QueryGenerationStrategy {

    public constructor(
        private readonly formHandlingStrategy: FormHandlingStrategy,
    ) { }

    public inferFormValueFromQuery(queryParams: Params, formValue: Record<string, unknown>): object {
        const queryObject: Record<string, unknown> = {};

        for (const key of Object.keys(formValue)) {
            queryObject[key] = this.formHandlingStrategy.parse(queryParams[key]);
        }

        return queryObject;
    }


    public convertFormValueToQueryObject(formValue: Record<string, unknown>): object {
        const queryObject: Record<string, unknown> = {};

        for (const key of Object.keys(formValue)) {
            queryObject[key] = this.formHandlingStrategy.stringify(formValue[key]);
        }

        return queryObject;
    }

    public createClearingObject(formValue: object): object {
        const filtersObject: Record<string, null> = {};

        for (const key of Object.keys(formValue)) {
            filtersObject[key] = null;
        }

        return filtersObject;
    }

}