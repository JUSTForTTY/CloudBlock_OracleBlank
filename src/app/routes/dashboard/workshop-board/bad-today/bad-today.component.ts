import { Component, OnInit, Input } from '@angular/core';

const sourceData = [
  { item: '关键缺陷', count: 17 },
  { item: '主要缺陷', count: 40 },
  { item: '次要缺陷', count: 21 },

];

const scale = [{
  dataKey: 'count',
  min: 0,
}];

const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'count',
  field: 'count',
  dimension: 'item',
  as: 'count'
});
const data = dv.rows;
@Component({
  selector: 'app-bad-today',
  templateUrl: './bad-today.component.html',
  styleUrls: ['./bad-today.component.less']
})



export class BadTodayComponent implements OnInit {
  theme = require('assets/js/chartstheme.js');
  constructor() { }

  ngOnInit() {
  }
  forceFit: boolean = true;
  @Input() height: number = 400;
  data = data;
  scale = scale;
  pieStyle = {
    stroke: "#fff",
    lineWidth: 1
  };
  labelConfig = ['count', {
    offset: -30,
    textStyle: {
      rotate: 0,
      textAlign: 'center',
      shadowBlur: 2,
      shadowColor: 'rgba(0, 0, 0, .45)'
    }
  }];

}
