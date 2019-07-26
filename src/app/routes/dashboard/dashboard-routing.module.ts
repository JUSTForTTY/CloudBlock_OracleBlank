import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YieldDashboardComponent } from './yield-dashboard/yield-dashboard.component';

const routes: Routes = [
  { path: 'yieldDashboard', component: YieldDashboardComponent, data: { title: '良率报表' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { 

  

}
