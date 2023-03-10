import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormFields } from 'src/app/models/form-fields-type';
import { FormUrlSettingsService } from 'src/app/services/form-url-settings.service';
import { Subject } from 'rxjs';

interface RegisterForm {
    firstName: string | null;
    secondName: string | null;
    age: number | null;
    email: string | null;
    phone: number | null;
    country: string | null;
    city: string | null;
    birth: Date | null;
}

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnDestroy {

    private readonly destroySubject = new Subject<boolean>();

    public registerForm = this.fb.group<FormFields<RegisterForm>>({
        firstName: new FormControl(''),
        secondName: new FormControl(''),
        age: new FormControl(null),
        email: new FormControl(''),
        phone: new FormControl(null),
        country: new FormControl(''),
        city: new FormControl(''),
        birth: new FormControl(null),
    });

    public readonly formUrlParamsObservable = this.formUrlSettings.formUrlParamsChangesObservable;

    constructor(
        private readonly formUrlSettings: FormUrlSettingsService,
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnDestroy(): void {
        this.destroySubject.next(true);
    }

    public async reset() {
        this.registerForm.reset();
        await this.router.navigate([], { relativeTo: this.route });
    }

}
