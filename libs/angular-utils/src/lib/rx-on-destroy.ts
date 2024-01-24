import {
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  TypeDecorator,
} from '@angular/core';
import { Observable } from 'rxjs';
import { decorateDirectiveOrComponent } from './decorate-lifecycle-hook';

export function RxOnDestroy(): TypeDecorator {
  return ((type: DirectiveType<unknown> | ComponentType<unknown>) => {
    decorateDirectiveOrComponent(type, 'ngOnDestroy');
  }) as TypeDecorator;
}

export interface RxOnDestroy {
  readonly ngOnDestroy$: Observable<void>;
}
