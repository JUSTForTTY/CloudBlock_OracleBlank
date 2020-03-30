import { Component, OnInit,ViewChild,ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-yield-productline',
  templateUrl: './yield-productline.component.html',
  styleUrls: ['./yield-productline.component.less']
})
export class YieldProductlineComponent implements OnInit {
  theme = require('assets/js/chartstheme.js');
  goodBadData = [
    { 'name': '良品', 'SUZ15SMT-A': 100, 'SUZ15SMT-B': 100, 'SUZ15SMT-C': 100, 'SUZ15SMT-D': 100, 'SUZ15SMT-E': 100, 'SUZ15SMT-F': 100, 'SUZ15SMT-G': 100, 'SUZ15SMT-H': 100, 'SUZ15SMT-I': 100 },
    { 'name': '不良品', 'SUZ15SMT-A': 10, 'SUZ15SMT-B': 10, 'SUZ15SMT-C': 10, 'SUZ15SMT-D': 10, 'SUZ15SMT-E': 10, 'SUZ15SMT-F': 10, 'SUZ15SMT-G': 10, 'SUZ15SMT-H': 10, 'SUZ15SMT-I': 10 }
  ]
  goodBadDataFields = ['SUZ15SMT-A', 'SUZ15SMT-B', 'SUZ15SMT-C', 'SUZ15SMT-D', 'SUZ15SMT-E', 'SUZ15SMT-F', 'SUZ15SMT-G', 'SUZ15SMT-H', 'SUZ15SMT-I']
  yieldData = [
    { line: 'SUZ15SMT-A', value: 0.5 },
    { line: 'SUZ15SMT-B', value: 4 },
    { line: 'SUZ15SMT-C', value: 3.5 },
    { line: 'SUZ15SMT-D', value: 5 },
    { line: 'SUZ15SMT-E', value: 4.9 },
    { line: 'SUZ15SMT-F', value: 6 },
    { line: 'SUZ15SMT-G', value: 7 },
    { line: 'SUZ15SMT-H', value: 9 },
    { line: 'SUZ15SMT-I', value: 13 },
  ];
  forceFit: boolean = true;
  
  @Input() height: number = 400;
  constructor() { }
  ngOnInit() {
    this.initData();
  }
  initData() {
    for (const key in this.goodBadData[0]) {
      if (this.goodBadData[0].hasOwnProperty(key) && key !== 'name') {
        this.goodBadData[0][key] = this.goodBadData[0][key] + (Math.floor(Math.random() * (1 - 20)) + 20);
        this.goodBadData[1][key] = this.goodBadData[1][key] + (Math.floor(Math.random() * (1 - 20)) + 10);
        this.yieldData.forEach(element => {
          if (element.line === key) {
            element.value = Math.floor(this.goodBadData[0][key] / (this.goodBadData[1][key] + this.goodBadData[0][key]) * 1000) / 1000
          }
        });
      }
    }
    this.goodBadData.splice(0,0,this.goodBadData[1])
    this.goodBadData.splice(2,1)
    console.log('yield-goodBadData', this.goodBadData);
    console.log('yield-yieldData', this.yieldData);
    this.goodBadDataTransform();
  }
  goodBadDataTransform() {
    const dv = new DataSet.View().source(this.goodBadData);
    dv.transform({
      type: 'fold',
      fields: this.goodBadDataFields,
      key: '类型',
      value: '产出',
    });
    this.goodBadData = dv.rows;
  }

}
