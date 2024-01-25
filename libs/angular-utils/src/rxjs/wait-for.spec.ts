import { fakeAsync, tick } from '@angular/core/testing';
import { Subject, tap } from 'rxjs';
import { waitFor } from './wait-for';

describe('RXJS - waitFor', () => {
  it('should skip emissions until "signal" observable has emitted', fakeAsync(() => {
    const source$ = new Subject<object>();
    const signal$ = new Subject<object>();

    let called = 0;
    const sub = source$
      .pipe(
        waitFor(signal$),
        tap(() => (called += 1)),
      )
      .subscribe();

    source$.next({});
    source$.next({});
    source$.next({});

    expect(called).toBe(0);

    signal$.next({});
    tick();

    expect(called).toBe(1);

    source$.next({});

    expect(called).toBe(1);

    signal$.next({});

    expect(called).toBe(2);

    sub.unsubscribe();
    source$.complete();
    signal$.complete();
  }));
});
