import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-table',
  templateUrl: './plan-table.component.html',
  styleUrls: ['./plan-table.component.less']
})
export class PlanTableComponent implements OnInit {
  nzPageSize = 6;
  nzPageIndex = 1;
  nzTotal;
  nzTotalPage;
  okLine=0.9
  badLine=0.6
  constructor() { }
  listOfData = [
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
      element['计划达成率']=element.产出数量/element.计划数量;
      element['达成状态']=element['计划达成率']>=this.okLine?"#00EE00":(element['计划达成率']<this.badLine?"red":"#FFA500")
    });
  }

}
