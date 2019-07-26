import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ColorPickerModule } from 'ngx-color-picker';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { YieldDashboardComponent } from './yield-dashboard/yield-dashboard.component';

@NgModule({
  declarations: [YieldDashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonModule,
    ColorPickerModule,NgxGraphModule, NgxChartsModule,FormsModule,SharedModule
    
  ]
})
export class DashboardModule { }
