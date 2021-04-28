import { Component, OnInit } from '@angular/core';
const sourceData = [
  { name: 'WEEK1', 'PE': 18, 'EE': 28, 'TE': 39, 'AE': 81, 'IT': 47, 'JE': 20},
  { name: 'WEEK2', 'PE': 12, 'EE': 23, 'TE': 34, 'AE': 99, 'IT': 52, 'JE': 35},
  { name: 'WEEK3', 'PE': 18, 'EE': 32, 'TE': 45, 'AE': 76, 'IT': 47, 'JE': 33},
  { name: 'WEEK4', 'PE': 14, 'EE': 28, 'TE': 22, 'AE': 33, 'IT': 54, 'JE': 20}
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
  selector: 'app-depart-count',
  templateUrl: './depart-count.component.html',
  styleUrls: ['./depart-count.component.less']
})
export class DepartCountComponent implements OnInit {
  theme = require('assets/js/chartstheme.js');
  forceFit: boolean = true;
  height: number = 450;
  data = data;
  adjust = [{
    type: 'dodge',
    marginRatio: 1 / 32,
  }];
  label=Label
  constructor() { }

  ngOnInit() {
  }

}
