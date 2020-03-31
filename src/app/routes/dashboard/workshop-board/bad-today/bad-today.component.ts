import { Component, OnInit, Input } from '@angular/core';

const sourceData = [
  { item: '事例一', count: 40 },
  { item: '事例二', count: 21 },
  { item: '事例三', count: 17 },
  { item: '事例四', count: 13 },
  { item: '事例五', count: 9 }
];

const scale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%',
}];

const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
});
const data = dv.rows;
@Component({
  selector: 'app-bad-today',
  templateUrl: './bad-today.component.html',
  styleUrls: ['./bad-today.component.less']
})



export class BadTodayComponent implements OnInit {

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
  labelConfig = ['percent', {
    offset: -40,
    textStyle: {
      rotate: 0,
      textAlign: 'center',
      shadowBlur: 2,
      shadowColor: 'rgba(0, 0, 0, .45)'
    }
  }];

}
