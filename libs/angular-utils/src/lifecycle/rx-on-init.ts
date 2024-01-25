import {
  ɵComponentType as ComponentType,
  ɵDirectiveType as DirectiveType,
  TypeDecorator,
} from '@angular/core';
import { Observable } from 'rxjs';
import { decorateDirectiveOrComponent } from './decorate-lifecycle-hook';

export function RxOnInit(): TypeDecorator {
  return ((type: DirectiveType<unknown> | ComponentType<unknown>) => {
    decorateDirectiveOrComponent(type, 'ngOnInit');
  }) as TypeDecorator;
}

export interface RxOnInit {
  readonly ngOnInit$: Observable<void>;
}
