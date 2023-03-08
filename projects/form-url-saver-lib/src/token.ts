import { InjectionToken, Provider } from "@angular/core";

export interface FormHandlingStrategy {
    stringify(value: unknown): string;
    parse(value: string): object;
}

class DefaultFormHandlingStrategy {

    public stringify(value: unknown) {
        return JSON.stringify(value);
    }

    public parse(value?: string) {
        if (!value) {
            return undefined;
        }

        return JSON.parse(value);
    }
}

export const FormHandlingStrategyToken = new InjectionToken<() => FormHandlingStrategy>('ngx-form-url-saver')

export const NGX_FORM_URL_SAVER_STRATEGY_PROVIDER: Provider = {
    provide: FormHandlingStrategyToken,
    useFactory: () => new DefaultFormHandlingStrategy(),
}
