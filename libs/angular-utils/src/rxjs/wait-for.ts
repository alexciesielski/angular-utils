import { Observable, take, throttle } from 'rxjs';

/** Skips emissions until "signal" emits a value. */
export function waitFor<T>(signal: Observable<unknown>) {
  return (source: Observable<T>) =>
    source.pipe(
      throttle(() => signal.pipe(take(1)), {
        leading: false,
        trailing: true,
      }),
    );
}
