import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { RpsBoardService, WorkShop, FactoryCode } from './rps-board.service';

import { RpsBoardComponent } from "./rps-board.component";



@Component({
  selector: 'app-rps-boardv2',
  templateUrl: './rps-board.component.html',
  styleUrls: ['./rps-board.component.less']
})
export class RpsBoardv2Component extends RpsBoardComponent implements OnInit {

  constructor(protected http: HttpService,
    protected route: ActivatedRoute, public rpsBoardService: RpsBoardService) {
    super(http, route, rpsBoardService)
    this.blockHeight=100;
    rpsBoardService.fourBlock = {
      'SUZ01': {
        workShopCode: 'SUZ15-P1',
        isAdding: false,
        sort: 2
      },
      'SUZ02': {
        workShopCode: 'SUZ21-P2',
        isAdding: false,
        sort: 3
      },
    }
  }
 






}

