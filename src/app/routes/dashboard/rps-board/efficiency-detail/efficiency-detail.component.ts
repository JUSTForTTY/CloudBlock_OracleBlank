import { Component, Input, OnInit } from '@angular/core';
import { EfficiencyFormula } from "../datas";
@Component({
  selector: 'app-efficiency-detail',
  templateUrl: './efficiency-detail.component.html',
  styleUrls: ['./efficiency-detail.component.less']
})
export class EfficiencyDetailComponent implements OnInit {
  @Input() data: EfficiencyFormula;

  constructor() { }

  ngOnInit() {
    console.log('EfficiencyDetailComponent data',this.data)
  }

}
