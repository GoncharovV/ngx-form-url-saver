import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormUrlSaverDirective } from './form-url-saver.directive';
import { NGX_FORM_URL_SAVER_STRATEGY_PROVIDER } from '../token';


@NgModule({
    declarations: [
        FormUrlSaverDirective
    ],
    imports: [
        RouterModule,
    ],
    exports: [
        FormUrlSaverDirective
    ],
    providers: [
        NGX_FORM_URL_SAVER_STRATEGY_PROVIDER,
    ]
})
export class FormUrlSaverLibModule {
}
