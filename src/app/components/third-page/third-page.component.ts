import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';

@Component({
    selector: 'app-third-page',
    templateUrl: './third-page.component.html',
    styleUrls: ['./third-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPageComponent {

    public readonly defaultParams = {
        color: new FormControl(null),
        range: new FormControl(0),
        progress: new FormControl(50),
    };

    public registerForm = new FormGroup(this.defaultParams);

    public readonly formUrlParamsObservable = this.formUrlSettings.formUrlParamsChangesObservable;

    constructor(private readonly formUrlSettings: FormUrlSettingsService) {}

}
