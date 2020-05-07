import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
@Component({
  selector: 'app-plan-table',
  templateUrl: './plan-table.component.html',
  styleUrls: ['./plan-table.component.less']
})
export class PlanTableComponent implements OnInit {
  nzPageSize = 5;
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

  @Input() data$: ReplaySubject<any>;
  public dataSub: Subscription;

  @ViewChild('basicTable') basicTable: ElementRef;
  constructor() { }
  listOfData: any[] = [
    { 产线: 'SUZ15SMT-A', 计划数量: 6888, 产出数量: 6800 },
    { 产线: 'SUZ15SMT-B', 计划数量: 8695, 产出数量: 7534 },
    { 产线: 'SUZ15SMT-C', 计划数量: 200, 产出数量: 166 },
    { 产线: 'SUZ15SMT-D', 计划数量: 8695, 产出数量: 6800 },
    { 产线: 'SUZ15SMT-E', 计划数量: 7234, 产出数量: 2658 },
    { 产线: 'SUZ15SMT-F', 计划数量: 6566, 产出数量: 6800 },
    { 产线: 'SUZ15SMT-G', 计划数量: 1235, 产出数量: 336 },
    { 产线: 'SUZ15SMT-H', 计划数量: 21101, 产出数量: 18888 },
    { 产线: 'SUZ15SMT-I', 计划数量: 7877, 产出数量: 6800 },
    { 产线: 'SUZ15SMT-J', 计划数量: 114, 产出数量: 100 },
    { 产线: 'SUZ15SMT-K', 计划数量: 5245, 产出数量: 3456 },
  ];
  ngOnInit() {
    // this.listOfData.forEach(element => {
    //   element['计划达成率'] = element.产出数量 / element.计划数量;
    //   element['达成状态'] = element['计划达成率'] >= this.okLine ? "#00EE00" : (element['计划达成率'] < this.badLine ? "red" : "#FFA500")
    // });
    this.listOfData=[];
    for (let index = 0; index < this.nzPageSize; index++) {
      this.listOfData.push({})
    }
    this.newData = true;
    //自适应高度
    this.heightSub = this.height$.subscribe(height => {
      console.log(height, 'plan-tableDivHeight3', height)
      this.height = height;
      this.changeHeight(height);
    });

    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }

    this.nzTimer = setInterval(() => {
      this.changePage();
    }, 5000)
    this.getData();

  }
  getData() {
    this.dataSub = this.data$.subscribe(leftData => {
      this.listOfData = [];
      console.log('yield-plan-leftData', leftData)
      console.log('yield-plan-alarmSettingData', leftData.alarmSettingData)
      const alarmSettingData = leftData.alarmSettingData.data;
      let yieldAlarm = {};
      const data = leftData.yeildData.data;
      //组装报警信息
      alarmSettingData.forEach(element => {
        yieldAlarm[element.proLineCode] = {
          okLine: element.wshopAlarmsettingSplan === '' ? 0 : element.wshopAlarmsettingSplan,
          badLine: element.wshopAlarmsettingAplan === '' ? 0 : element.wshopAlarmsettingAplan
        }
      });
      //组装列表数据
      data.forEach(element => {
        let item = {
          产线: element.prolineCode,
          计划数量: element.timeslotPlanNum,
          产出数量: element.timeslotGoodsNum + element.timeslotBadsNum,
        }
        if (!item.计划数量 || item.计划数量 === 0) {
          item['计划达成率'] = "无计划";
          item['达成状态'] = "red";
        } else {
          const 计划达成率 = Math.floor(item.产出数量 / item.计划数量 * 100);
          item['达成状态'] = 计划达成率 >= yieldAlarm[item.产线].okLine ? "#00EE00" : (计划达成率 < yieldAlarm[item.产线].badLine ? "red" : "#FFA500")
          item['计划达成率'] = 计划达成率 + "%";
        }
        this.listOfData.push(item);
      });
      if (this.listOfData.length == 0) {
        for (let index = 0; index < this.nzPageSize; index++) {
          this.listOfData.push({})
        }
      }
      setTimeout(() => {
        if (this.height) {
          console.log('yield-plan-changeHeight', this.height)
          this.changeHeight(this.height);
        }
      }, 10);

      console.log('yield-plan-listOfData2', this.listOfData)

    });
  }
  changeHeight(height) {
    console.log('this.basicTable',this.basicTable)
    const tableHeight = this.basicTable['elementRef'].nativeElement.offsetHeight;
    const lineHeight = (tableHeight - 5) / ((this.basicTable['data'] as Array<any>).length + 1);

    this.nzPageSize = parseInt((height + 5) / lineHeight + '') - 1;
    if (this.nzPageSize < 1)
      this.nzPageSize = 1;
    this.nzPageIndex = 1;
    this.newData = true;
    console.log(height, 'plan-tableDivHeight3', this.nzPageSize)

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
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

  }

}
