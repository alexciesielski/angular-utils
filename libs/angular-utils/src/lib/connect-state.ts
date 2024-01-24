import { ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, Subject, from, isObservable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

type ObservableDictionary<T> = {
  [P in keyof T]: Observable<T[P]>;
};

type SubjectDictionary<T> = {
  [P in keyof T]: Subject<T[P]>;
};

type LoadingDictionary<T> = {
  [P in keyof T]: boolean;
};

type RestrictedKeys<T> = ObservableDictionary<T> & {
  $?: never;
  $emitted?: never;
};

export type StateObject<T = unknown> = Readonly<T> & {
  $: SubjectDictionary<T>;
  $emitted: LoadingDictionary<T>;
};

/**
 * Creates an object that is automatically updated whenever any of the inner Observables emit.
 * Automatically unsubscribes all Observables when the component is destroyed.
 *
 * Useful to bind your Observables to be used in components HTML template and auto-trigger change detection.
 *
 * @param sources a mapping of keys to Observable values
 */
export function connectState<T>(sources: RestrictedKeys<T>) {
  const cdRef = inject(ChangeDetectorRef);
  const destroyRef = inject(DestroyRef);

  const sink = {
    $: {},
    $emitted: {},
  } as StateObject<T>;

  const sourceKeys = Object.keys(sources) as Array<keyof T>;
  for (const key of sourceKeys) {
    sink.$[key] = new ReplaySubject<T[keyof T]>(1);
    sink.$emitted[key] = false;
  }

  from(sourceKeys)
    .pipe(
      mergeMap((sourceKey: keyof T) => {
        const source$ = (sources as ObservableDictionary<T>)[sourceKey];

        if (!isObservable(source$)) {
          throw new Error(
            `connectState: source of "state.${String(
              sourceKey
            )}" is not an Observable`
          );
        }

        return source$.pipe(
          tap((sinkValue: T[keyof T]) => {
            sink.$[sourceKey].next(sinkValue);
            sink.$emitted[sourceKey] = true;
            sink[sourceKey] = sinkValue as StateObject<T>[keyof T];
          })
        );
      })
    )
    .pipe(takeUntilDestroyed(destroyRef))
    .subscribe(() => cdRef.markForCheck());

  return sink;
}
