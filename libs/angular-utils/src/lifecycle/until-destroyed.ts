import { Observable, takeUntil } from 'rxjs';
import { RxOnDestroy } from './rx-on-destroy';

export function untilDestroyed<T extends RxOnDestroy>(instance: T) {
  return <U>(source: Observable<U>) => {
    if (!instance.ngOnDestroy$) {
      throw new Error(`${instance.constructor.name} is using untilDestroyed but doesn't implement RxOnDestroy`);
    }

    return source.pipe(takeUntil<U>(instance.ngOnDestroy$));
  };
}
