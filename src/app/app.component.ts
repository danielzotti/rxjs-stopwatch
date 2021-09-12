import { Component } from '@angular/core';
import { StopwatchService } from './stopwatch/stopwatch.service';

@Component({
  selector: 'dz-root',
  template: `
    <h1>
      {{title}}
    </h1>
    <dz-stopwatch [count]="count$ | async"
                  [interval]="interval$ | async"
                  [initialCount]="initialCount$ | async"
                  [isPlaying]="isPlaying$ | async"
                  (countChange)="onCountChange($event)"
                  (intervalChange)="onIntervalChange($event)"
                  (play)="onPlay()"
                  (pause)="onPause()"
                  (stop)="onStop()"
    ></dz-stopwatch>
  `,
  styles: []
})
export class AppComponent {
  title = 'rxjs-stopwatch';
  count$ = this.stopwatchService.count$;
  initialCount$ = this.stopwatchService.initialCount$;
  interval$ = this.stopwatchService.interval$;
  isPlaying$ = this.stopwatchService.isPlaying$;

  constructor(private stopwatchService: StopwatchService) {
  }

  onCountChange(count: number) {
    this.stopwatchService.inputInitialCount$.next(count);
  }

  onIntervalChange(interval: number) {
    this.stopwatchService.inputInterval$.next(interval);
  }

  onPlay() {
    this.stopwatchService.play$.next();
  }

  onPause() {
    this.stopwatchService.pause$.next();
  }

  onStop() {
    this.stopwatchService.stop$.next();
  }
}
