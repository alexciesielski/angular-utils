import { InjectionToken, Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Mock, RecursivePartial } from 'ts-mockery';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstructorFunction<T> = abstract new (...args: any[]) => T;

/**
 * Creates a mock of given service `provide` with defined implementation `mock`.
 * Use this if you need to mock a service in your unit test
 * and need to specify return values.
 *
 * @param provide the service to mock
 * @param mock the mock implementation
 */
export const mockWith = <T>(provide: ConstructorFunction<T> | Type<T> | InjectionToken<T>, mock: T) =>
  ({
    provide,
    useFactory: () => mock,
  } as Provider);

/**
 * Creates a mock of all properties of a given service.
 * Use this if you need to mock a service in your unit test
 * but don't care about the return values of functions.
 * @param provide the service to mock
 */
export const mockAll = <T>(provide: ConstructorFunction<T> | Type<T> | InjectionToken<T>) => ({
  provide,
  useFactory: () => Mock.all<T>(),
});

/**
 * Extends the mocked provider by the given properties.
 * Use this if you need to extend an already-mocked service in your unit test
 * @param provider the service to be extended
 * @param extendWith the value to extend the service with
 */
export function extendMockProvider<T>(
  provider: ConstructorFunction<T> | Type<T> | InjectionToken<T>,
  extendWith: RecursivePartial<T>
): void {
  Mock.extend(TestBed.inject(provider)).with(extendWith);
}
