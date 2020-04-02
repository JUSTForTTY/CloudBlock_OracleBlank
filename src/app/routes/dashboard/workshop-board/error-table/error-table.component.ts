import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
@Component({
  selector: 'app-error-table',
  templateUrl: './error-table.component.html',
  styleUrls: ['./error-table.component.less']
})
export class ErrorTableComponent implements OnInit {

  nzPageSize = 6;
  nzPageIndex = 1;
  nzTotal;
  nzTotalPage;
  okLine = 0.9
  badLine = 0.6

  newData = false;
  //定时器
  private nzTimer;
  public heightSub: Subscription;
  @Input() height$: ReplaySubject<number>;
  height = null;
  @ViewChild('basicTable') basicTable: ElementRef;
  constructor() { }
  listOfData = [
    { 产线: 'SUZ15SMT-A', 计划数量: 6888, 产出数量: 6800, 停线类型: '良率', 停线原因: '良率监测过低，设备调试导致。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-B', 计划数量: 8695, 产出数量: 7534, 停线类型: '关键缺陷', 停线原因: '出现关键缺陷。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-C', 计划数量: 200, 产出数量: 166, 停线类型: '主要缺陷', 停线原因: '主要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-D', 计划数量: 8695, 产出数量: 6800, 停线类型: '次要缺陷', 停线原因: '次要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-E', 计划数量: 7234, 产出数量: 2658, 停线类型: '良率', 停线原因: '良率监测过低。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-F', 计划数量: 6566, 产出数量: 6800, 停线类型: '关键缺陷', 停线原因: '出现关键缺陷。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-G', 计划数量: 1235, 产出数量: 336, 停线类型: '主要缺陷', 停线原因: '主要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-H', 计划数量: 21101, 产出数量: 18888, 停线类型: '次要缺陷', 停线原因: '次要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-I', 计划数量: 7877, 产出数量: 6800, 停线类型: '良率', 停线原因: '良率监测过低。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-J', 计划数量: 114, 产出数量: 100, 停线类型: '关键缺陷', 停线原因: '出现关键缺陷。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-K', 计划数量: 5245, 产出数量: 3456, 停线类型: '主要缺陷', 停线原因: '主要缺陷超标。', 责任人: "张三" },

  ];
  ngOnInit() {
    this.listOfData.forEach(element => {
      element['计划达成率'] = element.产出数量 / element.计划数量;
      element['达成状态'] = element['计划达成率'] >= this.okLine ? "red" : (element['计划达成率'] < this.badLine ? "#FFA500" : "#00EE00")
    });

    this.newData = true;
    //自适应高度
    this.heightSub = this.height$.subscribe(height => {
      console.log(height, 'error-tableDivHeight3', height, this.basicTable['tableMainElement'].nativeElement.offsetHeight)
      this.height = height;
      this.changeHeight(height);
    });

    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }

    this.nzTimer = setInterval(() => {
      this.changePage();
    }, 5000)
  }
  changeHeight(height) {
    const tableHeight = this.basicTable['tableMainElement'].nativeElement.offsetHeight;
    console.log(height, 'error-tableDivHeight3', tableHeight)
    const lineHeight = (tableHeight - 5) / ((this.basicTable['data'] as Array<any>).length + 1);

    this.nzPageSize = parseInt((height + 5) / lineHeight + '') - 1;
    if (this.nzPageSize < 1)
      this.nzPageSize = 1;
    this.nzPageIndex = 1;
    this.newData = true;
  }
  changePage() {

    if (this.newData) {
      this.newData = false;
      this.nzPageIndex = 1;
      this.nzTotal = this.listOfData.length;
    } else {
      if (this.nzPageIndex * this.nzPageSize < this.nzTotal) {
        this.nzPageIndex++;
      } else {
        this.nzPageIndex = 1;
      }
    }
  }
  ngOnDestroy() {
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
    if (this.heightSub) {
      this.heightSub.unsubscribe();
    }
  }


}
