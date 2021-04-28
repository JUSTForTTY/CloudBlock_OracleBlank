import { Component, Input, OnInit } from '@angular/core';
const sourceData = [
  { name: 'WEEK1', 'PE': 5.5, 'EE': 4.5, 'TE': 3.9, 'AE': 3.1,  'JE': 2.0 },
  { name: 'WEEK2', 'PE': 3.3, 'EE': 2.3, 'TE': 3.4, 'AE': 4.9, 'IT': 5.2, 'JE': 3.5 },
  { name: 'WEEK3', 'PE': 4.2, 'EE': 3.2,  'AE': 6.6, 'IT': 4.7, 'JE': 3.3 },
  { name: 'WEEK4', 'PE': 5.2, 'EE': 2.8, 'TE': 2.2, 'AE': 1.3, 'IT': 5.4, 'JE': 2.0 }
];
const Fields = ['PE', 'EE', 'TE', 'AE', 'IT', 'JE']
const sourceData2 = [
  { name: 'WEEK1', 'PE': 18, 'EE': 28, 'TE': 12, 'AE': 34, 'IT': 21, 'JE': 20 },
  { name: 'WEEK2', 'PE': 12, 'EE': 23, 'TE': 32, 'AE': 21, 'IT': 23,  },
  { name: 'WEEK3', 'PE': 18,  'TE': 12, 'AE': 26, 'IT': 12, 'JE': 33 },
  { name: 'WEEK4', 'PE': 14, 'EE': 28, 'TE': 22, 'AE': 21, 'IT': 32, 'JE': 20 }
];
const Fields2 = ['PE', 'EE', 'TE', 'AE', 'IT', 'JE']

const sourceData3 = [
  { name: 'WEEK1', 'SMT': 18, 'WAVE': 28, 'COATING': 39, 'ATP': 64,},
  { name: 'WEEK2', 'SMT': 12, 'WAVE': 23, 'COATING': 34, 'ATP': 45, },
  { name: 'WEEK3', 'SMT': 18, 'WAVE': 32, 'COATING': 45, 'ATP': 74,  },
  { name: 'WEEK4', 'SMT': 14, 'WAVE': 28, 'COATING': 22, 'ATP': 33, }
];
const Fields3 = ['SMT', 'WAVE', 'COATING', 'ATP']


const Label = ['总数', function (val) {

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

enum EpageType {
  部门响应时间, 工段总时间
}

@Component({
  selector: 'app-depart-avg',
  templateUrl: './depart-avg.component.html',
  styleUrls: ['./depart-avg.component.less']
})
export class DepartAvgComponent implements OnInit {
  @Input() title = "部门-平均响应时间统计";
  @Input() type: EpageType = EpageType.部门响应时间;
  @Input() lineNum=5;
  theme = require('assets/js/chartstheme.js');
  forceFit: boolean = true;
  height: number = 400;
  adjust = [{
    type: 'dodge',
    marginRatio: 1 / 32,
  }];
  label = Label
  data;
  constructor() { }

  ngOnInit() {
    let source
    let fields
    if (this.type === EpageType.部门响应时间) {
      source = sourceData
      if(this.lineNum===15){
        source = sourceData2
      }

      fields = Fields;
    }else{
      source = sourceData3
      fields = Fields3;
    }
    const dv = new DataSet.View().source(source);
    dv.transform({
      type: 'fold',
      fields: fields,
      key: '部门',
      value: '总数',
    });
    const data = dv.rows;
    this.data = data;
    this.text = {
      position: 'start',
      style: {
        fill: '#fff',
        fontSize: 15,
        fontWeight: 'normal'
      },
      content: '合格线'+this.lineNum,
      offsetY: -3,
      offsetX: -20
    };
  }

  color = ['name', function (name) {
    console.log('name',name)
    switch (name) {
      case 'WEEK1':
        return '#3aa1ff'
        case 'WEEK2':
        return '#4ecb73'
        case 'WEEK3':
        return '#fcce72'
        case 'WEEK4':
        return '#8543e0'
    
      default:
        break;
    }
    return null;
  }]

  // start2:any={ '部门': 'PE', '总数': 5 };
  start2: any = (xScale, yScale) => {
    const max = yScale.总数.max;
    if (max > this.lineNum) {
      const start = ((max - this.lineNum) / max) * 100
      return ['0%', start + '%']
    } else
      return []; // 位置信息
  };


  // end:any=['30%', '50%'];
  end: any = (xScale, yScale) => {
    const max = yScale.总数.max;
    if (max > this.lineNum) {
      const start = ((max - this.lineNum) / max) * 100
      return ['100%', start + '%']
    } else
      return []; // 位置信息
  };
  text = {
    position: 'end',
    style: {
      fill: '#fff',
      fontSize: 15,
      fontWeight: 'normal'
    },
    content: '',
    offsetY: -5,
    offsetX: -15
  };
  lineStyle = {
    stroke: 'red',
    lineWidth: 2,
    lineDash: [3, 3]
  };

}
