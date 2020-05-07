import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpService } from 'ngx-block-core';
import { ReplaySubject, Subscription } from 'rxjs';
import { Chart } from '@antv/g2/dist/g2.min.js';

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
  @Input() height$: ReplaySubject<number>;
  chart: Chart;
  public heightSub: Subscription;

  public dataSub: Subscription;
  goodBadDataPercent = [];
  constructor(private http: HttpService) { }
  ngOnInit() {
    this.initData();
    this.heightSub = this.height$.subscribe(height => {
      console.log('roundDivHeight-YieldDailyComponent', height)
      this.height = height;
      this.render(height, this.yieldAlarm);
    });
  }

  setChartOpt(yieldAlarm) {
    this.color = ['name*percent*line', function (val, percent, line) {
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
  yieldAlarm = {};
  initData() {
    this.dataSub = this.data$.subscribe(leftData => {
      console.log('yield-workshopYeildData', leftData)
      console.log('yield-alarmSettingData', leftData.alarmSettingData)
      const alarmSettingData = leftData.alarmSettingData.data;
      const data = leftData.yeildData
      this.yieldData = [];
      this.goodBadDataPercent = [];
      this.yieldAlarm = {};
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
        this.yieldAlarm[element.proLineCode] = element.wshopAlarmsettingAyeild === '' ? 0 : element.wshopAlarmsettingAyeild;
      });
      this.setChartOpt(this.yieldAlarm);
      console.log('yield-yieldAlarm', this.yieldAlarm)
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
      this.render(this.height, this.yieldAlarm);
      console.log('yield-yieldData', this.yieldData);
      console.log('yield-goodBadDataPercent', this.goodBadDataPercent);

    });
  }
  render(height, yieldAlarm) {
    if (!this.height) return;
    if (this.goodBadDataFields.length === 0) return;
    // if (this.data.length == 0) return;
    if (this.chart) this.chart.destroy();
    console.log('yield-yieldData', this.yieldData);
    this.chart = new Chart({
      container: 'productline',
      autoFit: true,
      height: height - 8
    });
    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(this.goodBadDataPercent)
      .transform({
        type: 'percent',
        field: '产出',
        dimension: 'name',
        groupBy: ['line'],
        as: 'percent',
      });
    console.log('yield-goodBadDataPercent11', this.goodBadDataPercent);
    console.log('yield-goodBadDataPercent12', dv.rows);

    this.chart.scale({
      value: {
        min: 0,
        max: 1,
        formatter(val) {
          return (val * 100).toFixed(2) + '%';
        },
      },
      percent: {
        min: 0,
        max: 1,
        formatter(val) {
          return (val * 100).toFixed(2) + '%';
        },
      }
    });

    this.chart.legend({
      itemName: {
        style: {
          fill: '#fff',
        },
      }
    });
    this.chart.legend({
      itemName: {
        style: {
          fill: '#fff',
        },
      }
    });
    this.chart.axis('line', {
      label: {
        style: {
          fill: '#ffffff',
        },
      },
    }).axis('percent', {
      label: {
        style: {
          fill: '#ffffff',
        },
      },
    }).axis('value', {
      label: {
        style: {
          fill: '#ffffff',
        },
      },
    });

    const view1 = this.chart.createView();

    view1.data(dv.rows);


    view1.tooltip({
      shared: true,
      showMarkers: false,
    });

    view1
      .interval()
      .position('line*percent')
      .color('name*percent*line', function (val, percent, line) {
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
      })
      .label('产出*name', function (val, line) {
        if (line == '良品') {
          return {
            position: 'middle',
            offset: 0,
            style: {
              fill: '#fff',
              fontSize: 16,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            formatter(text) {
              if (text === '0') return '';
              return 0.5;
            }
          };
        } else {
          return {
            position: 'middle',
            offset: 0,
            style: {
              fill: '#fff',
              fontSize: 16,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            formatter(text) {
              if (text === '0') return '';
              return 0.5;
            }
          };
        }

      })
      .adjust('stack');

    view1.interaction('active-region');
    const view2 = this.chart.createView();
    const ds2 = new DataSet();
    const dv2 = ds2
      .createView()
      .source(this.yieldData)
      .transform({
        type: 'fold',
        fields: ['良率'],
        key: 'type',
        value: 'value',
      });
    view2.data(dv2.rows);
    view2
      .line()
      .position('line*value')
      .color('type', function (val) {
        return '#63B8FF';
      })
      .shape('smooth');

    view2
      .point()
      .position('line*value')
      .color('type', function (val) {
        return '#63B8FF';
      })
      .label('value*line', function (val, line) {
        if(val<0.01){
          return {
            // position: 'middle',
            offset: 12,
            style: {
              fill: '#fff',
              fontSize: 15,
              shadowBlur: 5,
              shadowColor: 'rgba(0, 0, 0, .8)'
            },
          };
        }
        else if (val < yieldAlarm[line]) {
          return {
            // position: 'middle',
            offset: 12,
            style: {
              fill: '#fff',
              fontSize: 15,
              shadowBlur: 5,
              shadowColor: 'rgba(0, 0, 0, .8)'
            },
            // formatter(val) {
            //   console.log('text2', val);
            //   if (val === 0) return '';
            //   return val;
            // }
          };
        } else {
          return {
            // position: 'middle',
            offset: -15,
            style: {
              fill: '#fff',
              fontSize: 15,
              shadowBlur: 5,
              shadowColor: 'rgba(0, 0, 0, .8)'
            },
            // formatter(val) {
            //   console.log('text2', val);
            //   if (val === 0) return '';
            //   return val;
            // }
          };
        }

      })
      .shape('circle');
    view2.axis({
      title: {},
      label: {}
    });

    console.log('yield-yieldData11', this.yieldData);
    console.log('yield-yieldData12', dv2.rows);
    this.chart.render();
  };
  goodBadDataTransform() {

    const dv = new DataSet.View().source(this.goodBadData);
    dv.transform({
      type: 'fold',
      fields: this.goodBadDataFields,
      key: 'line',
      value: '产出',
    });
    // this.goodBadData = dv.rows;
  }
  prolineYieldDataTransform() {
    const dv = new DataSet.View().source(this.yieldData);
    dv.transform({
      type: 'fold',
      fields: ['良率'],
      key: 'type',
      value: 'value',
    });
    // this.yieldData = dv.rows;
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
    this.render(this.height, this.yieldAlarm);
    console.log('yield-goodBadDataPercent', this.goodBadDataPercent);

  }
  ngOnDestroy() {

    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
    if (this.heightSub) {
      this.heightSub.unsubscribe();
    }

  }

}
