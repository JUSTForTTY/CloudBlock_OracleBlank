import { Component, OnInit } from '@angular/core';
import { Data, getTestData } from "./datas";
import { fromEvent as observableFromEvent, of as observableOf } from 'rxjs';

@Component({
  selector: 'app-rps-board',
  templateUrl: './rps-board.component.html',
  styleUrls: ['./rps-board.component.less']
})
export class RpsBoardComponent implements OnInit {
  /** 标准 */
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

  allData: {
    title: string;
    data: Data[];
    isLoading?: boolean;
  }[][] = [];
  topData: {
    title: string;
    data: Data[];
    isLoading?: boolean;
  }[] = [];
  bottomData: {
    title: string;
    data: Data[];
    isLoading?: boolean;
  }[] = [];
  fontSizeTitle1 = 42;//一级标题
  fontSizeTitle2 = 24;//二级标题
  tableSize: 'middle' | 'small' = 'middle';
  private nowTimeTimer;
  nowTime = Date.now();

  private dataTimer;
  constructor() {

  }

  ngOnInit() {

    if (window.screen.height <= 900) {
      this.fontSizeTitle1 = 32;//一级标题
      this.fontSizeTitle2 = 18;//二级标题
      this.tableSize = "small";
    }
    this.autoSize();
    this.nowTimeTimer = setInterval(() => this.nowTime = Date.now(), 1000)

    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
    this.getAllData();
    this.dataTimer = setInterval(() => {
      this.getAllData();
    }, 10 * 60 * 1000)

  }
  getAllData() {
    console.log('getAllData')
    this.topData = [];
    this.bottomData = [];
    this.allData = [];
    this.topData.push({
      title: 'SMT达成率',
      data: getTestData(),
      isLoading:true
    })
    this.topData.push({
      title: 'WAVE达成率',
      data: getTestData(),
      isLoading:true
    })
    this.bottomData.push({
      title: '选焊达成率',
      data: getTestData(),
      isLoading:true

    })
    this.bottomData.push({
      title: 'COATING达成率',
      data: getTestData(),
      isLoading:true
      // data:[]
    })
    this.allData.push(this.topData);
    this.allData.push(this.bottomData);
    setTimeout(() => {
      // 模拟数据
      for (const iterator of this.allData) {
        for (const data of iterator) {
          data.isLoading=false;
        }
      }
    }, 1);

  }
  autoSize() {
    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        if (window.innerHeight <= 900) {
          this.fontSizeTitle1 = 32;//一级标题
          this.fontSizeTitle2 = 18;//二级标题
          this.tableSize = "small";
        } else {
          this.fontSizeTitle1 = 42;//一级标题
          this.fontSizeTitle2 = 24;//二级标题
          this.tableSize = 'middle';
        }

      });
  }

  ngOnDestroy() {
    if (this.nowTimeTimer) {
      clearInterval(this.nowTimeTimer);
    }
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
  }
}
