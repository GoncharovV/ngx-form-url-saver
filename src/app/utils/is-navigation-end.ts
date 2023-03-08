import { NavigationEnd } from '@angular/router';

/**
 *
 */
export function isNavigationEnd(event: NavigationEnd | unknown): event is NavigationEnd {
    return event instanceof NavigationEnd;
}
