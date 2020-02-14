import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dz-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit {

  @Input()
  count: number;

  @Input()
  initialCount: number;

  @Input()
  interval: number;

  @Output()
  stop: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  pause: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  play: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  countChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  intervalChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  onCountChange(count: string) {
    let countValue;
    if (!count) {
      countValue = 0;
    }
    else {
      countValue = parseInt(count, 10);
    }
    this.countChange.emit(countValue);
  }

  onIntervalChange(interval: string) {
    let intervalValue: number;
    if (!interval) {
      intervalValue = 0;
    }
    else {
      intervalValue = parseInt(interval, 10);
    }

    this.intervalChange.emit(intervalValue);
  }
}
