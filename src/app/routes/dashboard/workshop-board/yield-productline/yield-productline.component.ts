import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpService } from 'ngx-block-core';
import { ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-yield-productline',
  templateUrl: './yield-productline.component.html',
  styleUrls: ['./yield-productline.component.less']
})
export class YieldProductlineComponent implements OnInit {
  theme = require('assets/js/chartstheme.js');
  color: any;
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
    }

  }];
  pointLabel: any

  scale: any = [{
    dataKey: 'value',
    min: 0,
    max: 105,
  }];

  goodBadData: any[] = [
    { 'name': '良品', 'SUZ15SMT-A': 100, 'SUZ15SMT-B': 80, 'SUZ15SMT-C': 101, 'SUZ15SMT-D': 68, 'SUZ15SMT-E': 100, 'SUZ15SMT-F': 66, 'SUZ15SMT-G': 69, 'SUZ15SMT-H': 77, 'SUZ15SMT-I': 50 },
    { 'name': '不良品', 'SUZ15SMT-A': 50, 'SUZ15SMT-B': 20, 'SUZ15SMT-C': 17, 'SUZ15SMT-D': 33, 'SUZ15SMT-E': 10, 'SUZ15SMT-F': 10, 'SUZ15SMT-G': 10, 'SUZ15SMT-H': 10, 'SUZ15SMT-I': 10 }
  ]
  goodBadDataFields = ['SUZ15SMT-A', 'SUZ15SMT-B', 'SUZ15SMT-C', 'SUZ15SMT-D', 'SUZ15SMT-E', 'SUZ15SMT-F', 'SUZ15SMT-G', 'SUZ15SMT-H', 'SUZ15SMT-I']
  yieldData: any[] = [
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
  @Input() data$: ReplaySubject<any>;
  public dataSub: Subscription;
  goodBadDataPercent = [];
  constructor(private http: HttpService) { }
  ngOnInit() {
    this.initData();
  }
  setChartOpt(yieldAlarm) {
    this.color = ['name*percent*line', function (val, percent,line) {
      // console.log('setChartOpt',yieldAlarm,val,percent,line)
      if (val === '不良品') {
        if (percent) {
          if (percent[0] < yieldAlarm[line]) {
            return '#FF0000'
          }
        }
        return '#FF7070';
      }
      return '#92D050';
    }]
    this.pointLabel = ['value*line', function (val, line) {
      if (val < yieldAlarm[line]) {
        return {
          // position: 'middle',
          offset: 12,
          textStyle: {
            fill: '#fff',
            fontSize: 15,
            shadowBlur: 5,
            shadowColor: 'rgba(0, 0, 0, .8)'
          },
          formatter: function formatter(text) {
            if (parseFloat(text) == 0) return '';
            return text;
          }
        };
      } else {
        return {
          // position: 'middle',
          offset: -15,
          textStyle: {
            fill: '#fff',
            fontSize: 15,
            shadowBlur: 5,
            shadowColor: 'rgba(0, 0, 0, .8)'
          },
          formatter: function formatter(text) {
            if (parseFloat(text) == 0) return '';
            return text;
          }
        };
      }

    }]
  }
  goodBadDataPercentTransform() {
    const dv = new DataSet.View().source(this.goodBadDataPercent);
    dv.transform({
      type: 'percent',
      field: '产出',
      dimension: 'name',
      groupBy: ['line'],
      as: 'percent',
    });
    this.goodBadDataPercent = dv.rows;

    this.scale = [{
      dataKey: 'percent',
      min: 0,
      max: 1,
      formatter: '.1%',
    },
    {
      dataKey: 'value',
      min: 0,
      max: 1,
      formatter: '.1%',
    }];
  }
  initData() {
    this.dataSub = this.data$.subscribe(leftData => {

      console.log('yield-workshopYeildData', leftData)
      console.log('yield-alarmSettingData', leftData.alarmSettingData)
      const alarmSettingData = leftData.alarmSettingData.data;
      let yieldAlarm = {};
      const data = leftData.yeildData
      this.yieldData = [];
      this.goodBadData = [{ name: '不良品' }, { name: '良品' }];
      this.goodBadDataFields = [];
      data.data.forEach(lineData => {
        this.yieldData.push({
          line: lineData.prolineCode,
          良率: lineData.timeslotYeild / 100,
        });
        this.goodBadData[0][lineData.prolineCode] = lineData.timeslotBadsNum;
        this.goodBadData[1][lineData.prolineCode] = lineData.timeslotGoodsNum;
        this.goodBadDataFields.push(lineData.prolineCode);
      });

      alarmSettingData.forEach(element => {
        yieldAlarm[element.proLineCode] = element.wshopAlarmsettingAyeild === '' ? 0 : element.wshopAlarmsettingAyeild;
      });
      this.setChartOpt(yieldAlarm);
      console.log('yield-yieldAlarm', yieldAlarm)
      for (const key in this.goodBadData[0]) {
        if (this.goodBadData[0].hasOwnProperty(key) && key !== 'name') {
          this.goodBadDataPercent.push({
            name: this.goodBadData[0]['name'],
            line: key,
            产出: this.goodBadData[0][key],
          })
        }
      }
      for (const key in this.goodBadData[1]) {
        if (this.goodBadData[1].hasOwnProperty(key) && key !== 'name') {
          this.goodBadDataPercent.push({
            name: this.goodBadData[1]['name'],
            line: key,
            产出: this.goodBadData[1][key],
          })
        }
      }

      this.goodBadDataPercentTransform();
      this.prolineYieldDataTransform();
      console.log('yield-yieldData', this.yieldData);
      console.log('yield-goodBadDataPercent', this.goodBadDataPercent);

    });
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
  prolineYieldDataTransform() {
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
    return '#63B8FF';;
  }]
  localInit() {
    for (const key in this.goodBadData[0]) {
      if (this.goodBadData[0].hasOwnProperty(key) && key !== 'name') {
        this.goodBadData[0][key] = this.goodBadData[0][key] + (Math.floor(Math.random() * (1 - 500)) + 500);
        this.goodBadData[1][key] = this.goodBadData[1][key] + (Math.floor(Math.random() * (1 - 180)) + 180);
        this.yieldData.forEach(element => {
          if (element.line === key) {
            element.良率 = Math.floor(this.goodBadData[0][key] / (this.goodBadData[1][key] + this.goodBadData[0][key]) * 1000) / 1000
          }
        });

      }
    }
    this.goodBadData.splice(0, 0, this.goodBadData[1])
    this.goodBadData.splice(2, 1)

    //baifenbi
    for (const key in this.goodBadData[0]) {
      if (this.goodBadData[0].hasOwnProperty(key) && key !== 'name') {
        this.goodBadDataPercent.push({
          name: this.goodBadData[0]['name'],
          line: key,
          产出: this.goodBadData[0][key],
        })
      }
    }
    for (const key in this.goodBadData[1]) {
      if (this.goodBadData[1].hasOwnProperty(key) && key !== 'name') {
        this.goodBadDataPercent.push({
          name: this.goodBadData[1]['name'],
          line: key,
          产出: this.goodBadData[1][key],
        })
      }
    }
    console.log('yield-yieldData', this.yieldData);
    console.log('yield-goodBadData', this.goodBadData);
    this.goodBadDataPercentTransform();
    this.prolineYieldDataTransform();
    console.log('yield-goodBadDataPercent', this.goodBadDataPercent);

  }
  ngOnDestroy() {

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }

  }

}
