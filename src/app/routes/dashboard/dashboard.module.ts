import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ColorPickerModule } from 'ngx-color-picker';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { YieldDashboardComponent } from './yield-dashboard/yield-dashboard.component';
import { YieldTableComponent } from './yield-table/yield-table.component';
import { YieldBarlineComponent } from './yield-barline/yield-barline.component';
import { YieldGaugeComponent } from './yield-gauge/yield-gauge.component';
import { ProlineErrormsgComponent } from './proline-errormsg/proline-errormsg.component';
import { WoOrderInfoComponent } from './wo-order-info/wo-order-info.component';
import { PerformanceTestComponent } from './performance-test/performance-test.component';
import { YieldBarlineV2Component } from './yield-barline-v2/yield-barline-v2.component';
import { PipeModule } from 'ngx-block-core';
import { ErrorItemModule } from "./rps-board/error-item/error-item.module";
@NgModule({
  declarations: [YieldDashboardComponent, YieldTableComponent, YieldBarlineComponent, YieldGaugeComponent, ProlineErrormsgComponent, WoOrderInfoComponent, PerformanceTestComponent, YieldBarlineV2Component],
  imports: [
    DashboardRoutingModule,
    CommonModule,ErrorItemModule,
    ColorPickerModule,NgxGraphModule, NgxChartsModule,FormsModule,SharedModule,PipeModule
    
  ]
})
export class DashboardModule { }
