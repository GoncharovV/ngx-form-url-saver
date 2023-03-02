import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

    // eslint-disable-next-line id-denylist
    public readonly form = new FormGroup({
        name: new FormControl(''),
        age: new FormControl(0),
    });

    constructor(
        private readonly activatedRoute: ActivatedRoute,
    ) {}

}
