import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
@Component({
  selector: 'app-plan-table',
  templateUrl: './plan-table.component.html',
  styleUrls: ['./plan-table.component.less']
})
export class PlanTableComponent implements OnInit {
  nzPageSize = 8;
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
    this.listOfData.forEach(element => {
      element['计划达成率'] = element.产出数量 / element.计划数量;
      element['达成状态'] = element['计划达成率'] >= this.okLine ? "#00EE00" : (element['计划达成率'] < this.badLine ? "red" : "#FFA500")
    });
    this.newData = true;
    //自适应高度
    this.heightSub = this.height$.subscribe(height => {
      console.log(height, 'plan-tableDivHeight3', height, this.basicTable['tableMainElement'].nativeElement.offsetHeight)
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
  }

}
