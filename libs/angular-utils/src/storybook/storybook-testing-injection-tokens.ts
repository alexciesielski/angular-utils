import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type StorybookInitWhen = () => Observable<unknown>;
export type StorybookRunOnInit = () => void;
export type StorybookHostStyles = string[];
export type StorybookBodyClasses = string[];

export const STORYBOOK_INIT_WHEN = new InjectionToken<StorybookInitWhen>('STORYBOOK_INIT_WHEN');
export const STORYBOOK_RUN_ON_INIT = new InjectionToken<StorybookRunOnInit>('STORYBOOK_RUN_ON_INIT');
export const STORYBOOK_HOST_STYLES = new InjectionToken<StorybookHostStyles>('STORYBOOK_HOST_STYLES');
export const STORYBOOK_BODY_CLASSES = new InjectionToken<StorybookHostStyles>('STORYBOOK_BODY_CLASSES');
