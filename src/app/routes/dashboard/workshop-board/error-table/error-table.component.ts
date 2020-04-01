import { Component, OnInit } from '@angular/core';

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
      element['达成状态']=element['计划达成率']>=this.okLine?"red":(element['计划达成率']<this.badLine?"#FFA500":"#00EE00")
    });
  }


}