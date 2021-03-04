import { Component, OnInit } from '@angular/core';
import { Data, getTestData } from "./datas";
import { fromEvent as observableFromEvent, of as observableOf } from 'rxjs';

@Component({
  selector: 'app-rps-board',
  templateUrl: './rps-board.component.html',
  styleUrls: ['./rps-board.component.less']
})
export class RpsBoardComponent implements OnInit {
  allData: {
    title: string;
    data: Data[];
  }[][] = [];
  topData: {
    title: string;
    data: Data[];
  }[] = [];
  bottomData: {
    title: string;
    data: Data[];
  }[] = [];
  fontSizeTitle1 = 42;//一级标题
  fontSizeTitle2 = 24;//二级标题
  tableSize: 'middle' | 'small' = 'middle';
  constructor() {
    this.topData.push({
      title: 'SMT达成率',
      data: getTestData()
    })
    this.topData.push({
      title: 'WAVE达成率',
      data: getTestData()
    })
    this.bottomData.push({
      title: '选焊达成率',
      data: getTestData()
    })
    this.bottomData.push({
      title: 'COATING达成率',
      data: getTestData(),
      // data:[]
    })
    this.allData.push(this.topData);
    this.allData.push(this.bottomData)

  }

  ngOnInit() {
    if (window.screen.height <= 900) {
      this.fontSizeTitle1 = 32;//一级标题
      this.fontSizeTitle2 = 18;//二级标题
      this.tableSize="small";
    }
    this.autoSize();

  }
  autoSize() {
    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        if (window.innerHeight <= 900) {
          this.fontSizeTitle1 = 32;//一级标题
          this.fontSizeTitle2 = 18;//二级标题
          this.tableSize="small";
        } else {
          this.fontSizeTitle1 = 42;//一级标题
          this.fontSizeTitle2 = 24;//二级标题
          this.tableSize='middle';
        }

      });
  }


}
