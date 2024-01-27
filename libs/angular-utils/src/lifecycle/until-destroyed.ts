import { Observable, isObservable, takeUntil } from 'rxjs';

export function untilDestroyed<T extends object>(instance: T) {
  return <U>(source: Observable<U>) => {
    if (!('ngOnDestroy$' in instance) || !isObservable(instance['ngOnDestroy$'])) {
      throw new Error(`${instance.constructor.name} is using untilDestroyed but doesn't implement RxOnDestroy`);
    }

    return source.pipe(takeUntil<U>(instance.ngOnDestroy$));
  };
}
