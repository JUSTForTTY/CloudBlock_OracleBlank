import { Component,Input, OnInit } from '@angular/core';
import { HttpService } from 'ngx-block-core';

@Component({
  selector: 'app-yield-table',
  templateUrl: './yield-table.component.html',
  styleUrls: ['./yield-table.component.less']
})
export class YieldTableComponent implements OnInit {

  @Input()dataSet = [

  ];
  constructor(private httpService: HttpService) {

  }


  ngOnInit() {
    
    
  }



}
