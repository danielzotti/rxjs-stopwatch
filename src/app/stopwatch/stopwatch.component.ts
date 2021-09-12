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

  @Input()
  isPlaying: boolean;

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
    this.countChange.emit(!count ? 0 : parseInt(count, 10));
  }

  onIntervalChange(interval: string) {
    this.intervalChange.emit(!interval ? 0 : parseInt(interval, 10));
  }
}
