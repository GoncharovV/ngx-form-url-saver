import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationHistoryService } from 'src/app/services/navigation-history.service';

@Component({
  selector: 'app-display-navigation',
  templateUrl: './display-navigation.component.html',
  styleUrls: ['./display-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayNavigationComponent {

    public readonly urlObservable = this.navigationHistory.currentUrlObservable;

    constructor(private readonly navigationHistory: NavigationHistoryService){}
}
