import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Data, getTestData } from "../datas";
@Component({
  selector: 'app-rps-table',
  templateUrl: './rps-table.component.html',
  styleUrls: ['./rps-table.component.less']
})
export class RpsTableComponent implements OnInit, OnDestroy {
  @Input()
  data: Data[] = getTestData() || [];
  @Input()
  tableSize = 'middle';
  @Input()
  standard = {
    complete: {
      good: 95,
      bad: 75
    },
    yield: {
      good: 90,
      bad: 85
    }
  }

  headData = {
    completeOk: 0,
    completeBad: 0,
    yieldOk: 0,
    yieldBad: 0
  }
  //定时器
  private nzTimer;
  newData = false;
  nzPageIndex = 1;
  nzPageSize = 5;
  nzTotal: Number;
  constructor() { }

  ngOnInit() {

    for (const iterator of this.data) {
      // 模拟数据
      // const randomNum = Math.floor(Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);
      // iterator.planAchievementRate = iterator.planAchievementRate + randomNum;
      // if (iterator.planAchievementRate > 100) iterator.planAchievementRate = 100;
      // iterator.yield = iterator.yield + randomNum;
      // if (iterator.yield > 100) iterator.yield = 99;
      // 获取状态
      // iterator.planAchievementRate = iterator.planAchievementRate * 100;
      // iterator.yield = iterator.yield * 100;
      iterator.completeStatus = this.getStatus('达成率', iterator.planAchievementRate);
      iterator.yieldStatus = this.getStatus('良率', iterator.yield);
    }
    this.getHeadData();
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
    this.newData = true;
    this.nzTimer = setInterval(() => {
      this.changePage();
    }, 5000)
  }
  /** 获取表头数据 */
  getHeadData() {
    this.headData = {
      completeOk: 0,
      completeBad: 0,
      yieldOk: 0,
      yieldBad: 0
    }
    this.nzTotal = this.data.length;
    for (const iterator of this.data) {
      if (iterator.completeStatus === 'exception') {
        this.headData.completeBad++;
      }
      else if (iterator.completeStatus === 'success') {
        this.headData.completeOk++;
      }
      if (iterator.yieldStatus === 'exception') {
        this.headData.yieldBad++;
      }
      else if (iterator.yieldStatus === 'success') {
        this.headData.yieldOk++;
      }
    }
  }
  /** 轮播 */
  changePage() {

    if (this.newData) {
      this.newData = false;
      this.nzPageIndex = 1;
      this.nzTotal = this.data.length;
    } else {
      if (this.nzPageIndex * this.nzPageSize < this.nzTotal) {
        this.nzPageIndex++;
      } else {
        this.nzPageIndex = 1;
      }
    }
  }
  /** 获取状态 */
  getStatus(type: '良率' | '达成率', value): 'success' | 'exception' | 'active' {
    if (type === '达成率') {
      if (value < this.standard.complete.bad) {
        console.log('exception', value);
        return 'exception';
      }
      else if (value > this.standard.complete.good) {
        console.log('success', value);

        return 'success'
      }
      else {
        console.log('active', value);
        return 'active'
      }
    }
    else if (type === '良率') {
      if (value < this.standard.yield.bad) {
        return 'exception'
      }
      else if (value > this.standard.yield.good) {
        return 'success'
      }
      else return 'active'
    }

  }
  ngOnDestroy() {
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
  }

}
