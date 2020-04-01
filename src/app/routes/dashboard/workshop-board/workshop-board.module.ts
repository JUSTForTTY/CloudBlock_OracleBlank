import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopBoardRoutingModule } from "./workshop-board-routing.module";
import { YieldProductlineComponent } from './yield-productline/yield-productline.component';
import { WorkshopBoardComponent } from './workshop-board.component';
import { SharedModule } from '@shared/shared.module';
import { PlanTableComponent } from './plan-table/plan-table.component';
import { ErrorTableComponent } from './error-table/error-table.component';
import { YieldDailyComponent } from './yield-daily/yield-daily.component';
import { PeopleTodayComponent } from './people-today/people-today.component';
import { BadTodayComponent } from './bad-today/bad-today.component';
@NgModule({
  declarations: [YieldProductlineComponent, WorkshopBoardComponent, PlanTableComponent, ErrorTableComponent, YieldDailyComponent, PeopleTodayComponent, BadTodayComponent],
  imports: [
    CommonModule,
    WorkshopBoardRoutingModule,SharedModule
  ]
})
export class WorkshopBoardModule { }
