import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationHistoryService } from 'src/app/services/navigation-history.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public readonly form = new FormGroup({
        name: new FormControl(''),
        age: new FormControl(0),
    });

    constructor(
        private readonly activatedRoute: ActivatedRoute,
    ) {}

}
