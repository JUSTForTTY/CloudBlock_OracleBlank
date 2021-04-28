import { Component, OnInit } from '@angular/core';
const sourceData = [
  { name: 'WEEK1', 'PE': 5.5, 'EE': 4.5, 'TE': 3.9, 'AE': 3.1, 'IT': 4.7, 'JE': 2.0 },
  { name: 'WEEK2', 'PE': 3.3, 'EE': 2.3, 'TE': 3.4, 'AE': 4.9, 'IT': 5.2, 'JE': 3.5 },
  { name: 'WEEK3', 'PE': 4.2, 'EE': 3.2, 'TE': 4.5, 'AE': 6.6, 'IT': 4.7, 'JE': 3.3 },
  { name: 'WEEK4', 'PE': 5.2, 'EE': 2.8, 'TE': 2.2, 'AE': 1.3, 'IT': 5.4, 'JE': 2.0 }
];

const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'fold',
  fields: ['PE', 'EE', 'TE', 'AE', 'IT', 'JE'],
  key: '部门',
  value: '总数',
});
const data = dv.rows;

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


@Component({
  selector: 'app-depart-avg',
  templateUrl: './depart-avg.component.html',
  styleUrls: ['./depart-avg.component.less']
})
export class DepartAvgComponent implements OnInit {
  theme = require('assets/js/chartstheme.js');
  forceFit: boolean = true;
  height: number = 450;
  data = data;
  adjust = [{
    type: 'dodge',
    marginRatio: 1 / 32,
  }];
  label = Label
  constructor() { }

  ngOnInit() {
  }

  // start2:any={ '部门': 'PE', '总数': 5 };
  start2: any = (xScale, yScale) => {
    const max = yScale.总数.max;
    if (max > 5) {
      const start = ((max - 5) / max) * 100
      return ['2%', start + '%']
    } else
      return []; // 位置信息
  };


  // end:any=['30%', '50%'];
  end: any = (xScale, yScale) => {
    const max = yScale.总数.max;
    if (max > 5) {
      const start = ((max - 5) / max) * 100
      return ['98%', start + '%']
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
    content: '合格线 5',
    offsetY: -5,
    offsetX: -15
  };
  lineStyle = {
    stroke: 'red',
    lineWidth: 2,
    lineDash: [3, 3]
  };

}
