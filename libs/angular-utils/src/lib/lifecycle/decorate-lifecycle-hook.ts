import {
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  InjectableType,
} from '@angular/core';
import { BehaviorSubject, filter, take } from 'rxjs';
import { getInstanceWeakMap } from './instance-weak-map';

export type LifecycleHook =
  | 'ngOnDestroy'
  | 'ngOnInit'
  | 'ngAfterViewInit'
  | 'ngAfterContentInit';

const instanceWeakMap = getInstanceWeakMap(
  () => new BehaviorSubject<boolean>(false)
);

function decorateLifecycleHook(
  lifecycleHook: string,
  lifecycleHookFn: (() => void) | null | undefined
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any) {
    // Invoke original lifecycle hook if it exists
    lifecycleHookFn?.call(this);
    instanceWeakMap.getInstanceSubject(this, lifecycleHook).next(true);
  };
}

export function decorateDirectiveOrComponent<T>(
  type: InjectableType<T> | DirectiveType<T> | ComponentType<T>,
  lifecycleHook: LifecycleHook
): void {
  // Override original lifecycle hook with decorated one
  Object.defineProperty(type.prototype, lifecycleHook, {
    value: decorateLifecycleHook(lifecycleHook, type.prototype[lifecycleHook]),
    enumerable: true,
  });

  // Add Observable property for lifecycle hook
  Object.defineProperty(type.prototype, `${lifecycleHook}$`, {
    get(this: object) {
      return instanceWeakMap
        .getInstanceSubject(this, lifecycleHook)
        .pipe(filter(Boolean), take(1));
    },
    // Make property enumerable so it can be accessed by other decorators, e.g. RxInput
    enumerable: true,
  });
}
