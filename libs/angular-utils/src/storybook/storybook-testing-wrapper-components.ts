import { AsyncPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, Optional } from '@angular/core';
import { first, map, of } from 'rxjs';
import {
  STORYBOOK_HOST_CLASSES,
  STORYBOOK_HOST_STYLES,
  STORYBOOK_INIT_WHEN,
  STORYBOOK_RUN_ON_INIT,
  StorybookHostClasses,
  StorybookHostStyles,
  StorybookInitWhen,
  StorybookRunOnInit,
} from './storybook-testing-injection-tokens';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-run-on-init',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorybookRunOnInitComponent {
  constructor(@Optional() @Inject(STORYBOOK_RUN_ON_INIT) readonly runOnInit: StorybookRunOnInit | null) {
    runOnInit?.();
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-init-when',
  standalone: true,
  imports: [AsyncPipe, StorybookRunOnInitComponent],
  template: `
    @if (initialized$ | async) {
    <storybook-run-on-init>
      <ng-content></ng-content>
    </storybook-run-on-init>
    } @else {
    <pre>storybook-init-when</pre>
    <span>waiting... </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorybookInitWhenComponent implements AfterViewInit, OnDestroy {
  constructor(
    @Optional() @Inject(STORYBOOK_INIT_WHEN) private readonly initWhen: StorybookInitWhen | null,
    @Optional() @Inject(STORYBOOK_HOST_STYLES) private readonly hostStyles: StorybookHostStyles | null,
    @Optional() @Inject(STORYBOOK_HOST_CLASSES) private readonly hostClasses: StorybookHostClasses | null
  ) {}

  readonly initialized$ = (this.initWhen?.() || of(true)).pipe(
    map(() => true),
    first()
  );

  private hostStylesElement: HTMLStyleElement | null = null;

  ngAfterViewInit(): void {
    if (this.hostStyles) {
      const host = document.querySelector('html');
      if (host) {
        const style = document.createElement('style');
        style.innerHTML = this.hostStyles.join('\n');
        host.appendChild(style);
        this.hostStylesElement = style;
      }
    }

    if (this.hostClasses) {
      const host = document.querySelector('html');
      if (host) {
        host.classList.add(...this.hostClasses);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.hostStylesElement) {
      this.hostStylesElement.remove();
    }

    if (this.hostClasses) {
      const host = document.querySelector('html');
      if (host) {
        host.classList.remove(...this.hostClasses);
      }
    }
  }
}
