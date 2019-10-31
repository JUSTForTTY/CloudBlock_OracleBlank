import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YieldDashboardComponent } from './yield-dashboard/yield-dashboard.component';
import { PerformanceTestComponent } from './performance-test/performance-test.component';
const routes: Routes = [
  { path: 'yieldDashboard', component: YieldDashboardComponent, data: { title: '良率报表' } },
  { path: 'performancetest', component: PerformanceTestComponent, data: { title: '性能测试' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { 

  

}
