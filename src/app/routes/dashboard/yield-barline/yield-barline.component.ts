import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
const DataSet = require('@antv/data-set');

const sourceData = [
  { name: '良品', '8:30-9:30.': 100, '9:30-10:30.': 128.8, '10:30-11:30.': 139.3, '11:30-12:30.': 181.4, '12:30-13:30': 147, '13:30-14:30.': 120.3, '14:30-15:30.': 124, '15:30-16:30.': 135.6, '16:30-17:30.': 135.6, '17:30-18:30.': 135.6, '18:30-19:30.': 135.6, '19:30-20:30.': 135.6 },
  { name: '不良品', '8:30-9:30.': 12.4, '9:30-10:30.': 23.2, '10:30-11:30.': 34.5, '11:30-12:30.': 99.7, '12:30-13:30': 52.6, '13:30-14:30.': 35.5, '14:30-15:30.': 37.4, '15:30-16:30.': 42.4, '16:30-17:30.': 35.6, '17:30-18:30.': 35.6, '18:30-19:30.': 35.6, '19:30-20:30.': 35.6 },
];
const pointSourceData = [
  { year: '8:30-9:30.', value: 96 },
  { year: '9:30-10:30.', value: 80 },
  { year: '10:30-11:30.', value: 100 },
  { year: '11:30-12:30.', value: 66 },
  { year: '12:30-13:30.', value: 49 },
  { year: '13:30-14:30.', value: 85 },
  { year: '14:30-15:30.', value: 88 },
  { year: '15:30-16:30.', value: 65 },
  { year: '16:30-17:30.', value: 10 },
  { year: '17:30-18:30.', value: 20 },
  { year: '18:30-19:30.', value: 30 },
  { year: '19:30-20:30.', value: 40 },
];

const standardOutputSourceData = [
  { year: '8:30-9:30.', value: 8 },
  { year: '9:30-10:30.', value: 8 },
  { year: '10:30-11:30.', value: 8 },
  { year: '11:30-12:30.', value: 8 },
  { year: '12:30-13:30.', value: 8 },
  { year: '13:30-14:30.', value: 8 },
  { year: '14:30-15:30.', value: 8 },
  { year: '15:30-16:30.', value: 8 },
  { year: '16:30-17:30.', value: 8 },
  { year: '17:30-18:30.', value: 8 },
  { year: '18:30-19:30.', value: 8 },
  { year: '19:30-20:30.', value: 8 },
];

const color = ['name', function (val) {
  if (val === '不良品') {
    return '#ff4d4f';
  }
  return '#2194ff';
}]
const potcolor = ['value', function (val) {

  return '#ff4d4f';

}]



const stackLabel = ['产出', function (val) {

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
      return text;
    }
  };
}]

const pointLabel = ['value', function (val) {

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

const labelInterval = ['value', {
  useHtml: true,
  htmlTemplate: function htmlTemplate(text, item) {
    var a = item.point;
    if (typeof (a.percent) === 'number') {
      a.percent = String(Math.round(a.percent * 100)) + "%"
    }
    return '<span class="g2-label-item"><p class="g2-label-item-value">' + a.value + '</p><p class="g2-label-item-percent">' + a.percent + '</p></div>';
  }
}]

const axisOpts = {
  position: "right"
};


@Component({
  selector: 'app-yield-barline',
  templateUrl: './yield-barline.component.html',
  styleUrls: ['./yield-barline.component.less']
})
export class YieldBarlineComponent implements OnInit, OnDestroy {
  @Input() dataSet = [];
  @Input() prolineCode;
  timer: any;
  scale = [{
    dataKey: 'FLAG1',
    tickInterval: 1,
    alias: '直通率（%）'
  }];

  timeslot = [];
  //时段
  timeslotTest = ['8:30-9:30.', '9:30-10:30.', '10:30-11:30.', '11:30-12:30.', '12:30-13:30.', '13:30-14:30.', '14:30-15:30.', '15:30-16:30.', '16:30-17:30.', '17:30-18:30.', '18:30-19:30.', '19:30-20:30.'];

  //产线良品不良品数统计数据
  prolineGBsourceData = [];

  //产线良率数据统计
  yieldData = [];

  forceFit: boolean = true;
  height: number = 400;
  color = color;
  potcolor = potcolor;
  stackLabel = stackLabel;
  pointLabel = pointLabel;
  axisOpts = axisOpts;
  adjust = [{
    type: 'dodge',
    marginRatio: 1 / 32,
  }];
  theme = require('assets/js/chartstheme.js');
  constructor(private httpService: HttpService, private pageService: PageService) {
    this.timer = setTimeout(this.setData, 0);
  }
  setData = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.getProlineData();
    this.timer = setTimeout(this.setData, 3000);
  }

  ngOnInit() {

    console.log("柱状图颜色", color);
    this.getProlineData();
  }


  //获取产线数据
  getProlineData() {


    this.httpService.getHttp("/yieldDashboard/" + this.prolineCode).subscribe((prolineData: any) => {

      console.log("产线良率数据", prolineData)
      this.prolineGBsourceData = [];
      this.prolineGBsourceData.push(prolineData.data.productBads);
      this.prolineGBsourceData.push(prolineData.data.productGoods);

      this.yieldData = prolineData.data.yieldData;

      this.timeslot = prolineData.data.timeslotData;
      console.log("产线良率数据-时段", this.timeslot);

      this.prolineDataTransform();
    });

  }

  prolineDataTransform() {

    console.log("产线良率数据", this.prolineGBsourceData)
    let dv = new DataSet.View().source(this.prolineGBsourceData);

    dv.transform({
      type: 'fold',
      fields: this.timeslot,
      key: '类型',
      value: '产出',
    });
    this.stackLabel = ['产出', function (val) {

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
          return text;
        }
      };
    }]

    this.color = ['name', function (val) {
      if (val === '不良品') {
        return '#ff4d4f';
      }
      return '#2194ff';
    }]

    this.prolineGBsourceData = dv.rows;

    console.log("产线良率数据处理", this.prolineGBsourceData)
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);

  }
}
