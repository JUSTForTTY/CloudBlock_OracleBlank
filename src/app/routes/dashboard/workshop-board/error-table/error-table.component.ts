import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { HttpService } from 'ngx-block-core';

const 处理状态 = {
  "0": "已停线",
  "1": "已停线",
  "2": "已停线",
  "3": "已复线",
  "4": "已复线",
  "5": "已复线",
  "6": "已复线",
  "7": "已复线",
  "8": "已复线",
}
@Component({
  selector: 'app-error-table',
  templateUrl: './error-table.component.html',
  styleUrls: ['./error-table.component.less']
})
export class ErrorTableComponent implements OnInit {

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

  @Input() workshopCode = "SUZ21-2F";
  @Input() shiftTypeCode = "2Shfit";
  //定时器
  private nzDataTimer;



  @ViewChild('basicTable') basicTable: ElementRef;
  constructor(private http: HttpService) { }
  listOfData: any[] = [
    { 产线: 'SUZ15SMT-A', 计划数量: 6888, 产出数量: 6800, 停线类型: '良率', 停线原因: '良率监测过低，设备调试导致。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-B', 计划数量: 8695, 产出数量: 7534, 停线类型: '关键缺陷', 停线原因: '出现关键缺陷。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-C', 计划数量: 200, 产出数量: 166, 停线类型: '主要缺陷', 停线原因: '主要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-D', 计划数量: 8695, 产出数量: 6800, 停线类型: '次要缺陷', 停线原因: '次要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-E', 计划数量: 7234, 产出数量: 2658, 停线类型: '良率', 停线原因: '良率监测过低。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-F', 计划数量: 6566, 产出数量: 6800, 停线类型: '关键缺陷', 停线原因: '出现关键缺陷。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-G', 计划数量: 1235, 产出数量: 336, 停线类型: '主要缺陷', 停线原因: '主要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-H', 计划数量: 21101, 产出数量: 18888, 停线类型: '次要缺陷', 停线原因: '次要缺陷超标。次要缺陷超标。次要缺陷超标', 责任人: "张三" },
    { 产线: 'SUZ15SMT-I', 计划数量: 7877, 产出数量: 6800, 停线类型: '良率', 停线原因: '良率监测过低。良率监测过低。良率监测过低。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-J', 计划数量: 114, 产出数量: 100, 停线类型: '关键缺陷', 停线原因: '出现关键缺陷。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-K', 计划数量: 5245, 产出数量: 3456, 停线类型: '主要缺陷', 停线原因: '主要缺陷超标。', 责任人: "张三" },
    { 产线: 'SUZ15SMT-L', 计划数量: 5245, 产出数量: 3456, 停线类型: '主要缺陷', 停线原因: '主要缺陷超标。', 责任人: "张三" },

  ];
  ngOnInit() {
    this.listOfData.forEach(element => {
      element['计划达成率'] = element.产出数量 / element.计划数量;
      element['达成状态'] = element['计划达成率'] >= this.okLine ? "red" : (element['计划达成率'] < this.badLine ? "#FFA500" : "#00EE00")
    });
    this.listOfData = [];
    for (let index = 0; index < this.nzPageSize; index++) {
      this.listOfData.push({})
    }

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
    this.getData();

    this.nzDataTimer = setInterval(() => {
      this.getData();
    }, 60 * 1000)
  }
  getData() {
    this.http.getHttp("/yieldDashboard/workshopHoldData/" + this.workshopCode + "/" + this.shiftTypeCode).subscribe((data: any) => {
      console.log('停线信息', data)
      this.listOfData=[];
      data.data.forEach(element => {
        let item = {
          资源点: element.resourceCode,
          停线类型: element.productHlineResType==='0'?'不良停线':'ECO停线',
          停线原因: element.productHlineResReason,
          处理状态: 处理状态[element.productHlineState],
          责任人: element.productHlineLongUser,
        }
        if (!item.处理状态) item.处理状态 = "已停线";
        this.listOfData.push(item);
      });
      setTimeout(() => {
        if (this.height) {
          console.log('停线信息-changeHeight', this.height,this.listOfData)
          if (this.listOfData.length == 0) {
            for (let index = 0; index < this.nzPageSize; index++) {
              this.listOfData.push({})
            }
          }
          this.changeHeight(this.height);
        }
      }, 10);
    });
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
    if (this.nzDataTimer) {
      clearInterval(this.nzDataTimer);
    }
    if (this.heightSub) {
      this.heightSub.unsubscribe();
    }
  }


}
