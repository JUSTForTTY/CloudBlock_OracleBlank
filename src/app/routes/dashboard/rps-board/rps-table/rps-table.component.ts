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
  tableSize='middle';

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
  nzPageSize = 7;
  nzTotal: Number;
  constructor() { }

  ngOnInit() {

    for (const iterator of this.data) {
      
      const randomNum = Math.floor(Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);
      iterator.complete = iterator.complete + randomNum;
      if (iterator.complete > 100) iterator.complete = 99;
      iterator.yield = iterator.yield + randomNum;
      if (iterator.yield > 100) iterator.yield = 99;
      iterator.completeStatus = this.getStatus('达成率', iterator.complete);
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
  getHeadData() {
    this.headData = {
      completeOk: 0,
      completeBad: 0,
      yieldOk: 0,
      yieldBad: 0
    }
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

  getStatus(type: '良率' | '达成率', value): 'success' | 'exception' | 'active' {
    if (type === '达成率'){
      if (value < 75) {
        console.log('exception',value);
        return 'exception';
      }
      else if (value > 95) {
        console.log('success',value);

        return 'success'
      }
      else{
        console.log('active',value);
        return 'active'
      }
    }
    else if (type === '良率') {
      if (value < 85) {
        return 'exception'
      }
      else if (value > 90) {
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
