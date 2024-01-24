import {
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  TypeDecorator,
} from '@angular/core';
import { Observable } from 'rxjs';
import { decorateDirectiveOrComponent } from './decorate-lifecycle-hook';

export function RxAfterViewInit(): TypeDecorator {
  return ((type: DirectiveType<unknown> | ComponentType<unknown>) => {
    decorateDirectiveOrComponent(type, 'ngAfterViewInit');
  }) as TypeDecorator;
}

export interface RxAfterViewInit {
  readonly ngAfterViewInit$: Observable<void>;
}
