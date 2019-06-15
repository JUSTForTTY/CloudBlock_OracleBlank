import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Myflow2Component } from './myflow2/myflow2.component';
import { WorkflowsettingComponent } from './workflowsetting/workflowsetting.component';
import { PublicworkflowComponent } from './publicworkflow/publicworkflow.component';
import { PublicflowstyleComponent } from './publicflowstyle/publicflowstyle.component';
import { FlowchartComponent } from './flowchart/flowchart.component';
import { FlowtrsComponent } from './flowtrs/flowtrs.component';
const routes: Routes = [

  { path: 'myflow', component: Myflow2Component, data: { title: '途程' } },
  { path: 'flowchart/:workFlowId', component: FlowchartComponent, data: { title: '途程图' } },
  { path: 'flowsetting', component: WorkflowsettingComponent, data: { title: '途程管理' } },
  { path: 'publicworkflow', component: PublicworkflowComponent, data: { title: '公共工序' } },
  { path: 'publicflowstyle', component: PublicflowstyleComponent, data: { title: '公共工序样式' } },
  { path: 'flowtrs', component: FlowtrsComponent, data: { title: '防呆工序组' } }
  
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
