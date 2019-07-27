import { Component, OnInit } from '@angular/core';
const data = [
  { year: '1951 年', sales: 38 },
  { year: '1952 年', sales: 52 },
  { year: '1956 年', sales: 61 },
  { year: '1957 年', sales: 145 },
  { year: '1958 年', sales: 48 },
  { year: '1959 年', sales: 38 },
  { year: '1960 年', sales: 38 },
  { year: '1962 年', sales: 38 },
];

const scale = [{
  dataKey: 'sales',
  tickInterval: 20,
}];
@Component({
  selector: 'app-yield-barline',
  templateUrl: './yield-barline.component.html',
  styleUrls: ['./yield-barline.component.less']
})
export class YieldBarlineComponent implements OnInit {
  forceFit: boolean = true;
  height: number = 400;
  data = data;
  scale = scale;
  theme=require('assets/js/chartstheme.js');
  constructor() { }

  ngOnInit() {
  }

}
