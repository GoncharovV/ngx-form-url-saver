import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { NavigationHistoryService } from 'src/app/services/navigation-history.service';

@Component({
    selector: 'app-display-navigation',
    templateUrl: './display-navigation.component.html',
    styleUrls: ['./display-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayNavigationComponent {

    public readonly urlObservable: Observable<string> = this.navigationHistory.currentUrlObservable.pipe(
        filter(url => this.isNotNull(url)),
    );

    public isNotNull(url: string | null | undefined): boolean {
        return Boolean(url);
    }

    constructor(
        private readonly navigationHistory: NavigationHistoryService,
    ) {}

}
