import { NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { RxInput } from './rx-input';
import { RxOnInit } from './rx-on-init';

@RxOnInit()
@Component({
  selector: 'angular-utils-decorated-component',
  standalone: true,
  template: `hello world`,
})
class DecoratedComponent implements OnInit {
  constructor() {
    this.rxInput$
      .pipe(
        tap((value) => {
          if (!this.manualOnInit$$.getValue()) {
            this.errored.emit('RxInput should emit after ngOnInit');
          } else if (!value) {
            this.errored.emit('RxInput should emit a value');
          } else {
            this.initialized.emit();
            if (value !== 'str') {
              this.errored.emit('RxInput should emit a value');
            }
          }
        }),
        take(1),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe();
  }

  @Input()
  @RxInput()
  rxInput: string | undefined;
  private readonly rxInput$!: Observable<string | undefined>;

  @Output() initialized = new EventEmitter<void>();
  @Output() errored = new EventEmitter<unknown>();

  private readonly manualOnInit$$ = new BehaviorSubject(false);

  ngOnInit() {
    this.manualOnInit$$.next(true);
  }
}

@Component({
  selector: 'angular-utils-host',
  standalone: true,
  imports: [NgIf, DecoratedComponent],
  template: `
    <angular-utils-decorated-component
      *ngIf="show"
      [rxInput]="'str'"
      (errored)="error = $event"
      (initialized)="counter = counter + 1"
    />
  `,
})
class HostComponent {
  show = false;
  counter = 0;
  error = null;
}

describe('RxInput', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents()
  );

  it('should emit after on init', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.counter).toBe(0);

    fixture.componentInstance.show = true;
    fixture.detectChanges();
    expect(fixture.componentInstance.counter).toBe(1);

    expect(fixture.componentInstance.error).toBe(null);
  });
});
