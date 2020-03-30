import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopBoardRoutingModule } from "./workshop-board-routing.module";
import { YieldProductlineComponent } from './yield-productline/yield-productline.component';
import { WorkshopBoardComponent } from './workshop-board.component';
import { SharedModule } from '@shared/shared.module';
@NgModule({
  declarations: [YieldProductlineComponent, WorkshopBoardComponent],
  imports: [
    CommonModule,
    WorkshopBoardRoutingModule,SharedModule
  ]
})
export class WorkshopBoardModule { }
