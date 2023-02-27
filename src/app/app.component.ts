import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public readonly form = new FormGroup({
        name: new FormControl(''),
        age: new FormControl(0),
    });

    constructor(
        private activatedRoute: ActivatedRoute
    ) {
    }

}
