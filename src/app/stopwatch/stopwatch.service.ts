import { Injectable } from '@angular/core';
import { merge, Observable, Subject, timer, NEVER } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  mapTo, pluck,
  scan,
  shareReplay,
  startWith,
  switchMap, tap,
  withLatestFrom
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {

  initialCounterState: CounterState = {
    isPlaying: false,
    count: 0,
    initialCount: 0,
    interval: 1000,
    countDiff: 1
  };

  // STATE
  public count$: Observable<number>;
  public interval$: Observable<number>;
  public initialCount$: Observable<number>;
  public isPlaying$: Observable<boolean>;

  // BUTTONS
  play$ = new Subject();
  stop$ = new Subject();
  pause$ = new Subject();
  inputCount$ = new Subject<number>();
  inputInterval$ = new Subject<number>();
  inputCountDiff$ = new Subject<number>();
  inputInitialCount$ = new Subject<number>();
  stopwatchState$: Observable<CounterState>;
  stopwatchCommands$; // = new Observable<CounterState>();
  stopwatchProgrammaticCommandsSubject = new Subject();
  stopwatchProgrammaticCommands$ = this.stopwatchProgrammaticCommandsSubject.asObservable();

  constructor() {

    this.stopwatchCommands$ = merge(
      // UI commands
      this.play$.pipe(mapTo({ isPlaying: true })),
      this.pause$.pipe(mapTo({ isPlaying: false })),
      this.stop$.pipe(mapTo({ ...this.initialCounterState })),
      this.inputCount$.pipe(map(c => ({ count: c }))),
      this.inputInterval$.pipe(map(i => ({ interval: i }))),
      this.inputCountDiff$.pipe(map(i => ({ countDiff: i }))),
      this.inputInitialCount$.pipe(map(c => ({ initialCount: c, count: c }))),
      // programmatic commands
      this.stopwatchProgrammaticCommands$ //.pipe(map(c => ({count: c})))
    );


    this.stopwatchState$ = this.stopwatchCommands$.pipe(
      startWith(this.initialCounterState),
      scan((counterState, command) => ({ ...counterState, ...command })),
      shareReplay(1)
    );

    this.count$ = this.stopwatchState$.pipe(
      pluck('count'),
      // map(s => s.count),
      distinctUntilChanged()
    );
    this.initialCount$ = this.stopwatchState$.pipe(
      pluck('initialCount'),
      // map(s => s.count),
      distinctUntilChanged()
    );
    this.interval$ = this.stopwatchState$.pipe(
      pluck('interval'),
      // map(s => s.interval),
      distinctUntilChanged()
    );
    this.isPlaying$ = this.stopwatchState$.pipe(
      pluck('isPlaying'),
      // map(s => s.isPlaying),
      distinctUntilChanged()
    );

    const calculateNewCountValue$ = merge(
      this.isPlaying$,
      this.inputInterval$
    ).pipe(
      withLatestFrom(this.stopwatchState$, (_, state) => state),
      switchMap(state => state.isPlaying ? timer(0, state.interval) : NEVER),
      withLatestFrom(this.stopwatchState$, (_, state) => state),
      map(state => state.count += state.countDiff)
    );


    const updateCounter$ = calculateNewCountValue$.pipe(
      tap(count => this.stopwatchProgrammaticCommandsSubject.next(count))
    );

    // IMPORTANT: we need to subscribe in order to run the stopwatch
    // updateCounter$.subscribe(s => console.log(s));
    updateCounter$.subscribe();

    // LOGS
    // this.stopwatchCommands$.subscribe(s => console.log('commands', s));
    // this.stopwatchState$.subscribe(s => console.log('state', s));
    // this.count$.subscribe(c => console.log('count', c));
    // this.interval$.subscribe(i => console.log('interval', i));
    // this.isPlaying$.subscribe(p => console.log('isPlaying', p));
  }

}


export interface CounterState {
  isPlaying: boolean,
  count: number,
  initialCount: number,
  interval: number,
  countDiff: number
}
