import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-second-page',
    templateUrl: './second-page.component.html',
    styleUrls: ['./second-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondPageComponent {


    // eslint-disable-next-line id-denylist
    public readonly form = new FormGroup({
        firstName: new FormControl(''),
        secondName: new FormControl(''),
        age: new FormControl(0),
        email: new FormControl(''),
        phone: new FormControl(''),
        country: new FormControl(''),
        city: new FormControl(''),
        birth: new FormControl(null),
    });

}
