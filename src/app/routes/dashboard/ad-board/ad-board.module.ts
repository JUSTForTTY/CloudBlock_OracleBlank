import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdBoardComponent } from './ad-board.component';
import { AdBoardRoutingModule } from "./ad-board-routing.module";
import { SharedModule } from "@shared";
import { DepartCountComponent } from './depart-count/depart-count.component';
import { DepartAvgComponent } from './depart-avg/depart-avg.component';
import { ErrorItemModule } from "../rps-board/error-item/error-item.module";
@NgModule({
  declarations: [AdBoardComponent, DepartCountComponent, DepartAvgComponent],
  imports: [
    CommonModule,
    AdBoardRoutingModule,
    SharedModule,
    ErrorItemModule
  ]
})
export class AdBoardModule { }
