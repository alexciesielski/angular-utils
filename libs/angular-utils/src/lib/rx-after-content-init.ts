import {
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  TypeDecorator,
} from '@angular/core';
import { Observable } from 'rxjs';
import { decorateDirectiveOrComponent } from './decorate-lifecycle-hook';

export function RxAfterContentInit(): TypeDecorator {
  return ((type: DirectiveType<unknown> | ComponentType<unknown>) => {
    decorateDirectiveOrComponent(type, 'ngAfterContentInit');
  }) as TypeDecorator;
}

export interface RxAfterContentInit {
  readonly ngAfterContentInit$: Observable<void>;
}
