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
  selector: 'app-people-today',
  templateUrl: './people-today.component.html',
  styleUrls: ['./people-today.component.less']
})

export class PeopleTodayComponent implements OnInit {
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
    lineWidth: 1,
  };
  labelConfig = ['percent', {
    formatter: (val, item) => {
      return item.point.item + ': ' + val;
    },
  }];
  guideHtml = '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">主机<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>';
  guidePosition = ['50%', '50%'];
}
