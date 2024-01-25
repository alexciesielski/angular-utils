import { fakeAsync, tick } from '@angular/core/testing';
import { Subject, tap } from 'rxjs';
import { throttleWhile } from './throttle-while';

describe('RXJS - throttleWhile', () => {
  it('should emit once and then skip emissions until "signal" observable has emitted', fakeAsync(() => {
    const source$ = new Subject<object>();
    const signal$ = new Subject<object>();

    let called = 0;
    const sub = source$
      .pipe(
        throttleWhile(signal$),
        tap(() => (called += 1)),
      )
      .subscribe();

    source$.next({});
    source$.next({});
    source$.next({});

    expect(called).toBe(1);

    signal$.next({});
    tick();

    expect(called).toBe(2);

    source$.next({});

    expect(called).toBe(2);

    signal$.next({});

    expect(called).toBe(3);

    sub.unsubscribe();
    source$.complete();
    signal$.complete();
  }));
});
