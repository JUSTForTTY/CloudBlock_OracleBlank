import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.less']
})
export class TimerComponent implements OnInit {
  @Input() time: number = 0;
  @Input() date: string;
  h: number = this.time / 3600
  m: number = (this.time - this.h * 3600) / 60
  s: number = this.time - this.h * 3600 - this.m * 60
  show: {
    h: string | number,
    m: string | number,
    s: string | number
  } = {
      h: this.h,
      m: this.m,
      s: this.s
    }
  timer
  /** true 正计时 false 倒计时 */
  type: boolean = true
  format: string;
  constructor() { }

  ngOnInit() {
    if (this.date) {
      const date = new Date(this.date);
      // console.log('date', this.date, date)
      this.time = (Date.now() - date.getTime()) / 1000
    }
    this.start()
  }
  start() {
    console.log('start')
    if (!this.timer) {
      this.reTime()
    }
  }

  pause() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
  reTime() {
    if (this.type) {
      this.time++
    } else if (this.time > 0) {
      this.time--
    } else {
      console.log('00:00:00')
      return false
    }
    this.formatOutput();
    this.timer = setTimeout(() => this.reTime(), 1000)
  }
  formatOutput() {
    this.h = parseInt(this.time / 3600 + '')
    this.m = parseInt((this.time - this.h * 3600) / 60 + '')
    this.s = parseInt((this.time - this.h * 3600 - this.m * 60) + '')

    // 格式化
    this.show.h = this.h < 10 ? `0${this.h}` : this.h
    this.show.m = this.m < 10 ? `0${this.m}` : this.m
    this.show.s = this.s < 10 ? `0${this.s}` : this.s
    this.format = `${this.show.h}:${this.show.m}:${this.show.s}`
    // console.log(this.format)
  }
}