import { NgIf } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Observable, Subject, catchError, scan, take, tap, throwError } from 'rxjs';
import { RxOnInit } from './rx-on-init';

@RxOnInit()
@Component({
  selector: 'angular-utils-decorated-component',
  standalone: true,
  template: `hello world`,
})
class DecoratedComponent implements OnInit, RxOnInit, OnDestroy {
  constructor() {
    this.emitter$$
      .pipe(
        take(3),
        scan((acc, curr) => [...acc, curr], [] as string[]),
        takeUntilDestroyed(inject(DestroyRef)),
        tap((emitted) => {
          const compareTo = ['constructor', 'ngOnInit', 'rxOnInit'];
          for (let i = 0; i < emitted.length; i++) {
            if (compareTo[i] !== emitted[i]) {
              throw new Error(`Expected "${compareTo[i]}" but got "${emitted[i]}"`);
            }
          }
        }),
        catchError((err) => {
          this.error.emit(err);
          return throwError(() => err);
        }),
      )
      .subscribe();

    this.ngOnInit$.subscribe(() => {
      this.emitter$$.next('rxOnInit');
      this.initialized.emit();
    });

    this.emitter$$.next('constructor');
  }

  private readonly emitter$$ = new Subject<string>();
  private lateSubscriptionWorks = false;

  readonly ngOnInit$!: Observable<void>;

  @Output() initialized = new EventEmitter<void>();
  @Output() error = new EventEmitter<unknown>();

  ngOnInit() {
    this.emitter$$.next('ngOnInit');

    setTimeout(() => {
      this.ngOnInit$.subscribe(() => {
        this.lateSubscriptionWorks = true;
      });
    }, 10);
  }

  ngOnDestroy() {
    if (!this.lateSubscriptionWorks) {
      this.error.emit('ngOnDestroy called before late subscription');
    }
  }
}

@Component({
  selector: 'angular-utils-host',
  standalone: true,
  imports: [NgIf, DecoratedComponent],
  template: `
    <angular-utils-decorated-component
      *ngIf="showFirst"
      (initialized)="firstCounter = firstCounter + 1"
      (error)="firstError = $event"
    />

    <angular-utils-decorated-component
      *ngIf="showSecond"
      (initialized)="secondCounter = secondCounter + 1"
      (error)="secondError = $event"
    />
  `,
})
class HostComponent {
  showFirst = false;
  showSecond = false;
  firstCounter = 0;
  secondCounter = 0;
  firstError: unknown | null = null;
  secondError: unknown | null = null;
}

describe('RxOnInit', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents(),
  );

  it('should emit after ngOnInit', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.firstCounter).toBe(0);
    expect(fixture.componentInstance.secondCounter).toBe(0);

    tick(100);
    fixture.componentInstance.showFirst = true;
    fixture.detectChanges();

    expect(fixture.componentInstance.firstCounter).toBe(1);
    expect(fixture.componentInstance.secondCounter).toBe(0);

    tick(100);
    fixture.componentInstance.showSecond = true;
    fixture.detectChanges();

    expect(fixture.componentInstance.firstCounter).toBe(1);
    expect(fixture.componentInstance.secondCounter).toBe(1);

    tick(100);
    fixture.componentInstance.showFirst = false;
    fixture.detectChanges();

    expect(fixture.componentInstance.firstCounter).toBe(1);
    expect(fixture.componentInstance.secondCounter).toBe(1);

    tick(100);
    fixture.componentInstance.showSecond = false;
    fixture.detectChanges();

    expect(fixture.componentInstance.firstCounter).toBe(1);
    expect(fixture.componentInstance.secondCounter).toBe(1);

    expect(fixture.componentInstance.firstError).toBe(null);
    expect(fixture.componentInstance.secondError).toBe(null);
  }));
});
