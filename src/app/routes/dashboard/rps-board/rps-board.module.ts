import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpsBoardComponent } from './rps-board.component';
import { RpsBoardRoutingModule } from "./rps-board-routing.module";
import { SharedModule } from '@shared/shared.module';
import { RpsTableComponent } from './rps-table/rps-table.component';
import { RpsTableComponentBack } from './rps-table-back/rps-table.component';
import { RpsBoardv2Component } from './rps-board.component.v2';

// import { DomVisibleDirective } from "./dom-visible.directive";
import { RpsBoardService } from "./rps-board.service";
import { ErrorDetailComponent } from './error-detail/error-detail.component';
// import { ChangeBgDirective } from "./changBg.directive";
import { RpsBlockComponent } from './rps-block/rps-block.component';
import { HeadModule } from './head/head.module';
import { TimerComponent } from './timer/timer.component';
import { ErrorItemModule } from "./error-item/error-item.module";
import { TimerModule } from "./timer/timer.module";
import { EfficiencyDetailComponent } from './efficiency-detail/efficiency-detail.component';
@NgModule({
  declarations: [RpsBoardComponent,RpsBoardv2Component, RpsTableComponent, ErrorDetailComponent, RpsBlockComponent,RpsTableComponentBack, EfficiencyDetailComponent],
  imports: [
    CommonModule,
    RpsBoardRoutingModule,
    SharedModule,
    ErrorItemModule,
    HeadModule,
    TimerModule
  ],
})
export class RpsBoardModule { }
