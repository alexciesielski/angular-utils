import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type UnwrapPromise<P> = P extends Promise<infer I> ? I : never;
export type UnwrapObservable<O> = O extends Observable<infer I> ? I : never;
export type UnwrapArray<A> = A extends Array<infer I> ? I : never;
export type UnwrapInjectionToken<T> = T extends InjectionToken<infer I> ? I : never;
export type UnwrapRecordKey<T> = T extends Record<infer K, infer _> ? K : never;
export type UnwrapRecordValue<T> = T extends Record<infer _K, infer V> ? V : never;

export type Unwrap<T> = UnwrapArray<T> | UnwrapObservable<T> | UnwrapPromise<T> | UnwrapInjectionToken<T>;
