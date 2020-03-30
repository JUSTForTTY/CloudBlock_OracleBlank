import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopBoardRoutingModule } from "./workshop-board-routing.module";
import { YieldProductlineComponent } from './yield-productline/yield-productline.component';

@NgModule({
  declarations: [YieldProductlineComponent],
  imports: [
    CommonModule,
    WorkshopBoardRoutingModule
  ]
})
export class WorkshopBoardModule { }
