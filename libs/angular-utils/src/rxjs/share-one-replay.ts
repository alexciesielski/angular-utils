import { MonoTypeOperatorFunction, shareReplay } from 'rxjs';

/**
 * Helper operator to encapsulate the shareReplay operator with a buffer size of 1 and refCount of true.
 */
export function shareOneReplay<T>(): MonoTypeOperatorFunction<T> {
  return (source) => source.pipe(shareReplay({ bufferSize: 1, refCount: true }));
}
