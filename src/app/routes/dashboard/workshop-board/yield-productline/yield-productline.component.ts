import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-yield-productline',
  templateUrl: './yield-productline.component.html',
  styleUrls: ['./yield-productline.component.less']
})
export class YieldProductlineComponent implements OnInit {
  theme = require('assets/js/chartstheme.js');
  color = ['name', function (val) {
    if (val === '不良品') {
      return '#ff4d4f';
    }
    return '#92D050';
  }]
  stackLabel = ['产出*name', function (val, line) {
    if (line == '良品') {
      return {
        position: 'middle',
        offset: 0,
        textStyle: {
          fill: '#fff',
          fontSize: 16,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)'
        },
        formatter: function formatter(text) {
          if (text === '0') return '';
          return text;
        }
      };
    } else {
      return {
        offset: 0,
        textStyle: {
          fill: '#fff',
          fontSize: 16,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)'
        },
        formatter: function formatter(text) {
          if (text === '0') return '';
          return text;
        }
      };
    }

  }];
  pointLabel = ['value', function (val) {

    return {
      position: 'middle',
      offset: 0,
      textStyle: {
        fill: '#fff',
        fontSize: 12,
        shadowBlur: 2,
        shadowColor: 'rgba(0, 0, 0, .45)'
      },
      formatter: function formatter(text) {

        text = text + "%"

        return text;
      }
    };
  }]
  scale = [{
    dataKey: 'value',
    min: 0,
    max: 105,
  }];

  goodBadData = [
    { 'name': '良品', 'SUZ15SMT-A': 100, 'SUZ15SMT-B': 100, 'SUZ15SMT-C': 100, 'SUZ15SMT-D': 100, 'SUZ15SMT-E': 100, 'SUZ15SMT-F': 100, 'SUZ15SMT-G': 100, 'SUZ15SMT-H': 100, 'SUZ15SMT-I': 100 },
    { 'name': '不良品', 'SUZ15SMT-A': 10, 'SUZ15SMT-B': 10, 'SUZ15SMT-C': 10, 'SUZ15SMT-D': 10, 'SUZ15SMT-E': 10, 'SUZ15SMT-F': 10, 'SUZ15SMT-G': 10, 'SUZ15SMT-H': 10, 'SUZ15SMT-I': 10 }
  ]
  goodBadDataFields = ['SUZ15SMT-A', 'SUZ15SMT-B', 'SUZ15SMT-C', 'SUZ15SMT-D', 'SUZ15SMT-E', 'SUZ15SMT-F', 'SUZ15SMT-G', 'SUZ15SMT-H', 'SUZ15SMT-I']
  yieldData = [
    { line: 'SUZ15SMT-A', 良率: 0.5 },
    { line: 'SUZ15SMT-B', 良率: 4 },
    { line: 'SUZ15SMT-C', 良率: 3.5 },
    { line: 'SUZ15SMT-D', 良率: 5 },
    { line: 'SUZ15SMT-E', 良率: 4.9 },
    { line: 'SUZ15SMT-F', 良率: 6 },
    { line: 'SUZ15SMT-G', 良率: 7 },
    { line: 'SUZ15SMT-H', 良率: 9 },
    { line: 'SUZ15SMT-I', 良率: 13 },
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
            element.良率 = Math.floor(this.goodBadData[0][key] / (this.goodBadData[1][key] + this.goodBadData[0][key]) * 1000) / 10
          }
        });
      }
    }
    this.goodBadData.splice(0, 0, this.goodBadData[1])
    this.goodBadData.splice(2, 1)
    console.log('yield-goodBadData', this.goodBadData);
    console.log('yield-yieldData', this.yieldData);
    this.goodBadDataTransform();
    this.prolineYieldDataTransform();
    console.log('yield-yieldData', this.yieldData);
    console.log('yield-goodBadData', this.goodBadData);
  }
  goodBadDataTransform() {
    const dv = new DataSet.View().source(this.goodBadData);
    dv.transform({
      type: 'fold',
      fields: this.goodBadDataFields,
      key: 'line',
      value: '产出',
    });
    this.goodBadData = dv.rows;
  }
  prolineYieldDataTransform(){
    const dv = new DataSet.View().source(this.yieldData);
    dv.transform({
      type: 'fold',
      fields: ['良率'],
      key: 'type',
      value: 'value',
    });
    this.yieldData = dv.rows;
  }
  potcolor = ['type', function (val) {
    // if (val === '良率') {
    //   return '#389e0d';
    // }
    return '#63B8FF';
  }]

}
