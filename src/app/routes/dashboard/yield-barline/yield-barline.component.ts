import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-yield-barline',
  templateUrl: './yield-barline.component.html',
  styleUrls: ['./yield-barline.component.less']
})
export class YieldBarlineComponent implements OnInit {
  @Input() dataSet = [

  ];
  scale = [{
    dataKey: 'FLAG1',
    tickInterval: 1,
    alias: '直通率（%）'
  }];
  
  
  forceFit: boolean = true;
  height: number = 400;

  theme = require('assets/js/chartstheme.js');
  constructor() { }

  ngOnInit() {
  }

}
