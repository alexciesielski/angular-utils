import { Observable, delayWhen, timer } from 'rxjs';

/**
 * Delays the emissions of the source observable by up to a given time.
 */
export function delayUpTo<T>(obs: () => Observable<T>, delayByUpTo: number): Observable<T> {
  const start = Date.now();
  return obs().pipe(
    delayWhen(() => {
      const end = Date.now();
      return timer(Math.max(0, delayByUpTo - (end - start)));
    })
  );
}
