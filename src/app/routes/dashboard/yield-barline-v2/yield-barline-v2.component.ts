import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
const DataSet = require('@antv/data-set');
import { Chart } from '@antv/g2/dist/g2.min.js';


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
  selector: 'app-yield-barline-v2',
  templateUrl: './yield-barline-v2.component.html',
  styleUrls: ['./yield-barline-v2.component.less']
})
export class YieldBarlineV2Component implements OnInit, OnDestroy {

  @Input() dataSet = [];
  @Input() prolineCode;
  @Input() prolineType;
  timer: any;


  timeslot = [];
  //时段
  timeslotTest = ['8:30-9:30.', '9:30-10:30.', '10:30-11:30.', '11:30-12:30.', '12:30-13:30.', '13:30-14:30.', '14:30-15:30.', '15:30-16:30.', '16:30-17:30.', '17:30-18:30.', '18:30-19:30.', '19:30-20:30.'];

  //产线良品不良品数统计数据
  prolineGBsourceData = [];

  //产线良率数据统计
  yieldData = [];

  forceFit: boolean = true;
  height: number = 490;
  color;
  potcolor;
  stackLabel = ['number*类型', function (val, 类型) {
    if (类型 == '计划') {
      return {
        offset: -20,
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
    } else if (类型 == '良品') {
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
    this.timer = setTimeout(this.setData, 30000);
  }

  ngOnInit() {

    this.getProlineData();
  }

  data = [];
  group = ['计划', '不良品', '良品']
  //获取产线数据
  getProlineData() {

    console.log("图-获取参数", this.prolineCode);
    console.log("图-获取参数", this.prolineType);

    this.httpService.getHttp("/yieldDashboard/goodsBadsData/" + this.prolineCode + "?prolineType=" + this.prolineType).subscribe((prolineData: any) => {

      console.log("图-产线报表-产线良率数据", prolineData)
      this.prolineGBsourceData = [];
      this.prolineGBsourceData.push(prolineData.data.productBads);
      this.prolineGBsourceData.push(prolineData.data.productGoods);

      this.yieldData = prolineData.data.yieldData;

      this.timeslot = prolineData.data.timeslotData;
      console.log("图-产线良率数据-时段", this.timeslot);

      // this.prolineDataTransform();


      //new
      this.data = [];
      this.timeslot.forEach(timename => {
        let dataitem = {}
        dataitem['计划'] = prolineData.data.productPlans[timename]
        dataitem['time'] = timename
        dataitem['不良品'] = prolineData.data.productBads[timename]
        dataitem['良品'] = prolineData.data.productGoods[timename]
        this.data.push(dataitem);
      });

      console.log("图-data", this.data)
      console.log("图-group", this.group)
      // this.prolineDataTransform_V2();
      // this.prolineYieldDataTransform();
      this.render();
    }, (err) => {
      console.log("图-看板数据-接口异常");

    });

  }
  scale = [{
    dataKey: 'number',
    tickInterval: 1000000,
  }];

  colorMap = {
    '计划': '#63B8FF',
    '良品': '#92D050',
    '不良品': '#ff4d4f',
  };
  polygonOpts = {
    color: ['类型', (类型) => {
      return this.colorMap[类型];
    }],
    tooltip: ['类型*number', (类型, number) => {
      return {
        name: 类型,
        value: number
      };
    }],
    adjust: [
      {
        type: 'dodge',
        dodgeBy: 'type', // 按照 type 字段进行分组
        marginRatio: 0 // 分组中各个柱子之间不留空隙
      },
      {
        type: 'stack'
      }
    ],
  };
  chart: Chart;
  render() {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart({
      container: 'yield2',
      autoFit: true,
      height: this.height
    });
    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(this.data)
      .transform({
        type: 'fold',
        fields: this.group,
        key: '类型',
        value: 'number',
        retains: ['time']
      })
      .transform({
        type: 'map',
        callback: obj => {
          const key = obj.类型;
          let type;
          console.log("图-key", key)
          if (key === '计划') {
            type = 'a';
          } else {
            type = 'b';
          }
          obj.type = type;
          return obj;
        }
      });
      this.chart.scale( {
        number:{
          min:0,
          tickCount:8
        },
        value: {
          min: 0,
        }
      });
      this.chart.legend({
        itemName: {
          style: {
            fill: '#fff',
          },
        }
      });
      this.chart
      .axis('time', {
        title: null,
        label: {
          style: {
            fill: '#ffffff',
          },
        }
      })
      .axis('number', {
        label: {
          style: {
            fill: '#ffffff',
          },
        },
        title: null,
      })
      .axis('value', {
        grid:null,
        label: {
          style: {
            fill: 'rgba(255, 255, 255, 0)'
          },
        },
        title: null,
      })
    const view1 = this.chart.createView();
    view1.data(dv.rows);
    console.log('dv.rows',dv.rows);
   
    view1.tooltip({
      showMarkers: false,
      shared: true,
    });
    view1
      .interval()
      .position('time*number')
      .color('类型', (类型) => {
        return this.colorMap[类型];
      }).
      label('number*类型', function (val, 类型) {
        if (类型 == '计划') {
          return {
            offset: -20,
            style: {
              fill: '#fff',
              fontSize: 16,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            content: val+'' === '0'?'':val,
          };
        } else if (类型 == '良品') {
          return {
            position: 'middle',
            offset: 0,
            style: {
              fill: '#fff',
              fontSize: 16,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            content: val+'' === '0'?'':val,

          };
        } else {
          return {
            offset: 0,
            style: {
              fill: '#fff',
              fontSize: 16,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            content: val+'' === '0'?'':val,

          };
        }
    
      })
      .adjust({
        type: 'dodge',
        dodgeBy: 'type', // 按照 type 字段进行分组
        marginRatio: 0 // 分组中各个柱子之间不留空隙
      });

    view1.interaction('active-region');

    const view2 = this.chart.createView();
    const ds2 = new DataSet();
    const dv2 = ds2
      .createView()
      .source(this.yieldData)
      .transform({
        type: 'fold',
        fields: ['良率', '效率'],
        key: 'type',
        value: 'value',
      });
    view2.data(dv2.rows);
    view2
      .line()
      .position('time*value')
      .color('type', function (val) {
        if (val === '良率') {
          return '#389e0d';
        }
        return '#d48806';
      })
      .shape('smooth');

    view2
      .point()
      .position('time*value')
      .color('type', function (val) {
        if (val === '良率') {
          return '#389e0d';
        }
        return '#d48806';
      }).label('value', function (val) {
        if(val>=98){
          return {
            position: 'middle',
            offset: -5,
            style: {
              fill: '#fff',
              fontSize: 16,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            content: val + '%',
          };
        }else{
          return {
            position: 'middle',
            offset: 0,
            style: {
              fill: '#fff',
              fontSize: 16,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)'
            },
            content: val + '%',
          };
        }
        
      })
      .shape('circle');
      view2.axis({
        title: {},
        label:{}
      });
    this.chart.render();
  }
  prolineDataTransform_V2() {
    let dv = new DataSet.View().source(this.data);
    dv.transform({
      type: 'fold',
      fields: this.group,
      key: '类型',
      value: 'number',
      retains: ['time']
    })
      .transform({
        type: 'map',
        callback: obj => {
          const key = obj.类型;
          let type;
          console.log("图-key", key)
          if (key === '计划') {
            type = 'a';
          } else {
            type = 'b';
          }
          obj.type = type;
          return obj;
        }
      });

    this.data = dv;
  }

  prolineYieldDataTransform() {

    let dv = new DataSet.View().source(this.yieldData);

    dv.transform({
      type: 'fold',
      fields: ['良率', '效率'],
      key: 'type',
      value: 'value',
    });

    this.pointLabel = ['value', function (val) {

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

          text = text + "%"

          return text;
        }
      };
    }]

    this.potcolor = ['type', function (val) {
      if (val === '良率') {
        return '#389e0d';
      }
      return '#d48806';
    }]

    this.yieldData = dv.rows;
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);

  }
}
