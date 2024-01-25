import { BehaviorSubject, switchMap } from 'rxjs';
import { getInstanceWeakMap } from './instance-weak-map';
import { RxAfterViewInit } from './rx-after-view-init';

const instanceWeakMap = getInstanceWeakMap(
  () => new BehaviorSubject<unknown>(undefined)
);

// This will be provided through Terser global definitions by Angular CLI. This will
// help to tree-shake away the code unneeded for production bundles.
declare const ngDevMode: boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RxViewChild<T>(): any {
  return function (
    targetPrototype: T,
    propertyName: keyof T,
    descriptor: PropertyDescriptor
  ) {
    const observablePropertyName = `${propertyName as string}$`;

    Object.defineProperty(targetPrototype, observablePropertyName, {
      get(this: RxAfterViewInit) {
        if (ngDevMode && !this.ngAfterViewInit$) {
          throw new Error(
            `RxViewChild is used on "${String(
              propertyName
            )}" but the component does not implement RxAfterViewInit`
          );
        }
        return this.ngAfterViewInit$.pipe(
          switchMap(() =>
            instanceWeakMap.getInstanceSubject(this, observablePropertyName)
          )
        );
      },
      enumerable: true,
    });

    const getFn = function (this: object) {
      return instanceWeakMap
        .getInstanceSubject(this, observablePropertyName)
        .getValue();
    };
    const setFn = function (this: object, value: unknown): void {
      return instanceWeakMap
        .getInstanceSubject(this, observablePropertyName)
        .next(value);
    };

    if (descriptor) {
      const originalSetter = descriptor.set;
      const originalGetter = descriptor.get;
      descriptor.get = getFn;
      descriptor.set = function (this: object, value: unknown) {
        if (originalSetter) {
          originalSetter.call(this, value);
        }
        if (originalGetter) {
          value = originalGetter.call(this);
        }
        return setFn.call(this, value);
      };
    } else {
      Object.defineProperty(targetPrototype, propertyName, {
        get: getFn,
        set: setFn,
        enumerable: true,
      });
    }
  };
}
