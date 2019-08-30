import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './test/test.component';











const routes: Routes = [
  //测试，无用
  { path: 'test', component: TestComponent },
  //工作流
  {
<<<<<<< HEAD
    path: 'workflow', loadChildren: '../workflow/workflow.module#WorkflowModule', data: { title: '工作流' }
=======
    path: 'workflow', loadChildren: './../workflow/workflow.module#WorkflowModule', data: { title: '工作流' }
>>>>>>> 23cc0b2d0033b4fbeea9b1285c35058b611187c8

  },
  //组织架构 
  {
<<<<<<< HEAD
    path: 'authority', loadChildren: '../organizational/organizational.module#OrganizationalModule', data: { title: '组织权限' }
=======
    path: 'authority', loadChildren: './../organizational/organizational.module#OrganizationalModule', data: { title: '组织权限' }
>>>>>>> 23cc0b2d0033b4fbeea9b1285c35058b611187c8
  },












];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
