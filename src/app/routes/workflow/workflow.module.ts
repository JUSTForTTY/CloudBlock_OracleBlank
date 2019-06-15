import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { Myflow2Component } from './myflow2/myflow2.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { WorkflowsettingComponent } from './workflowsetting/workflowsetting.component';
import { PublicworkflowComponent } from './publicworkflow/publicworkflow.component';
import { PublicflowstyleComponent } from './publicflowstyle/publicflowstyle.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { FlowtrsComponent } from './flowtrs/flowtrs.component';
@NgModule({
  imports: [
    CommonModule,
    ColorPickerModule,
    WorkflowRoutingModule,NgxGraphModule, NgxChartsModule,FormsModule,SharedModule
    
  ],
  declarations: [
    Myflow2Component,
    FlowchartComponent,
    WorkflowsettingComponent,
    PublicworkflowComponent,
    PublicflowstyleComponent,
    FlowtrsComponent]
})
export class WorkflowModule { }
