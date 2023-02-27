import { FormHandlingStrategy } from './../../token';
import { Params } from '@angular/router';
import { QueryGenerationStrategy } from './strategy';


export class United implements QueryGenerationStrategy {


    public constructor(
        private readonly formHandlingStrategy: FormHandlingStrategy,
        private readonly queryKey: string,
    ) { }

    public inferFormValueFromQuery(queryParams: Params): object {
        const query = queryParams[this.queryKey] as string;

        console.log('here we ate', queryParams);


        if (!query) {
            return {};
        }

        const formValue = this.formHandlingStrategy.parse(query);

        return formValue;
    }


    public convertFormValueToQueryObject(formValue: object): object {
        const serializedObject = this.formHandlingStrategy.stringify(formValue);

        return {
            [this.queryKey]: serializedObject,
        };
    }

    public createClearingObject(): object {
        return {
            [this.queryKey]: null,
        };
    }

}