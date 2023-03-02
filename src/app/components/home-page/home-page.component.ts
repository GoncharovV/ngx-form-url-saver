import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {

    // eslint-disable-next-line id-denylist
    public readonly form = new FormGroup({
        firstName: new FormControl(''),
        secondName: new FormControl(''),
        age: new FormControl(0),
        email: new FormControl(''),
        phone: new FormControl(''),
        country: new FormControl(''),
        city: new FormControl(''),
    });

}
