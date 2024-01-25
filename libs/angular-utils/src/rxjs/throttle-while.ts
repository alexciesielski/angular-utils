import { Observable, take, throttle } from 'rxjs';

/**
 * Emits the source's first value immediately and then waits with emissions
 * until signal emits, after which it emits the source's last value.
 */
export function throttleWhile<T>(signal: Observable<unknown>) {
  return (source: Observable<T>) =>
    source.pipe(
      throttle(() => signal.pipe(take(1)), {
        leading: true,
        trailing: true,
      }),
    );
}
