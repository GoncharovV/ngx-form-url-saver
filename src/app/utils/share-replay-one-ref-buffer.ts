import { MonoTypeOperatorFunction } from 'rxjs';
import { shareReplay } from 'rxjs/operators';


/**
 *
 */
export function shareReplayOneRefBuff<T>(): MonoTypeOperatorFunction<T> {
    return shareReplay<T>({
        refCount: true,
        bufferSize: 1,
    });
}
