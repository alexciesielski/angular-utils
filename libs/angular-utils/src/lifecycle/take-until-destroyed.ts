import { Observable, takeUntil } from 'rxjs';
import { RxOnDestroy } from './rx-on-destroy';

export function takeUntilDestroyed<T extends RxOnDestroy>(instance: T) {
  return <U>(source: Observable<U>) => {
    if (!instance.ngOnDestroy$) {
      throw new Error(`${instance.constructor.name} is using takeUntilDestroyed but doesn't implement RxOnDestroy`);
    }

    return source.pipe(takeUntil<U>(instance.ngOnDestroy$));
  };
}
