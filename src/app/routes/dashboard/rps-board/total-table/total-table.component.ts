import { Component, Input, OnInit } from '@angular/core';
import { TotalData } from '../rps-board.service';

@Component({
  selector: 'app-total-table',
  templateUrl: './total-table.component.html',
  styleUrls: ['./total-table.component.less']
})
export class TotalTableComponent implements OnInit {
  @Input() totalData: TotalData = {
    onlineSign: 0,
    kaoqin: 0,
    signTime: 0,
    effectiveOutput: 0,
    onlineEfficiency: 0,
    offlineEfficiency: 0,
    stdSignOfflineTime: 0,
    signCountOffline: 0,
    paiban: 0
  }
  constructor() { }

  ngOnInit() {
  }

}
