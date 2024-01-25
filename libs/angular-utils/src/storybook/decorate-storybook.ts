/* eslint-disable @typescript-eslint/no-explicit-any */
import { importProvidersFrom, ɵNG_MOD_DEF } from '@angular/core';
import { AngularRenderer, applicationConfig, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { DecoratorFunction } from '@storybook/types';
import {
  STORYBOOK_HOST_STYLES,
  STORYBOOK_INIT_WHEN,
  STORYBOOK_RUN_ON_INIT,
  StorybookInitWhen,
  StorybookRunOnInit,
} from './storybook-testing-injection-tokens';
import { StorybookInitWhenComponent } from './storybook-testing-wrapper-components';

export interface StorybookConfig {
  globals?: any[];
  imports?: any[];
  providers?: any[];
  declarations?: any[];
  /**
   * Renders the component only after the Observable emits
   */
  initWhen?: StorybookInitWhen;
  /**
   * This function is run only once when the component is rendered
   */
  runOnInit?: StorybookRunOnInit;
  /**
   * CSS styles to apply to the host component
   */
  styles?: string[];
}

export function decorateStorybook(config: StorybookConfig = {}): Array<DecoratorFunction<AngularRenderer, unknown>> {
  const { globals = [], imports = [], providers = [], declarations = [], initWhen, runOnInit, styles } = config;

  const decorators = [];

  if (initWhen) {
    globals.push({
      provide: STORYBOOK_INIT_WHEN,
      useValue: initWhen,
    });
  }

  if (runOnInit) {
    globals.push({
      provide: STORYBOOK_RUN_ON_INIT,
      useValue: runOnInit,
    });
  }

  if (styles) {
    globals.push({
      provide: STORYBOOK_HOST_STYLES,
      useValue: styles,
    });
  }

  decorators.push(
    applicationConfig({
      providers: [
        ...getImportsFromGlobals(globals).map((ngModule) => importProvidersFrom(ngModule)),
        getProvidersFromGlobals(globals),
      ],
    })
  );

  if (initWhen || runOnInit || styles) {
    decorators.push(
      moduleMetadata({ imports: [StorybookInitWhenComponent] }),
      componentWrapperDecorator(StorybookInitWhenComponent)
    );
  }

  decorators.push(
    moduleMetadata({
      imports,
      providers,
      declarations,
    })
  );

  return decorators;
}

const isModule = (provider: any) => !!provider['ngModule'] || !!provider[ɵNG_MOD_DEF];
function getImportsFromGlobals(globals: any[]) {
  return globals.filter((global) => isModule(global));
}
function getProvidersFromGlobals(globals: any[]) {
  return globals.filter((global) => !isModule(global));
}
