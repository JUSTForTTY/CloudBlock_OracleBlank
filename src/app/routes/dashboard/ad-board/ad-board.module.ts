import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdBoardComponent } from './ad-board.component';
import { AdBoardRoutingModule } from "./ad-board-routing.module";
import { SharedModule } from "@shared";
import { DepartAvgComponent } from './depart-avg/depart-avg.component';
import { ErrorItemModule } from "../rps-board/error-item/error-item.module";
import { HeadModule } from "../rps-board/head/head.module";
@NgModule({
  declarations: [AdBoardComponent, DepartAvgComponent],
  imports: [
    CommonModule,
    AdBoardRoutingModule,
    SharedModule,
    ErrorItemModule,
    HeadModule
  ]
})
export class AdBoardModule { }
