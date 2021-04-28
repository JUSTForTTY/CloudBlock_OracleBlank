import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YieldDashboardComponent } from './yield-dashboard/yield-dashboard.component';
import { PerformanceTestComponent } from './performance-test/performance-test.component';
import { RpsBoardComponent } from './rps-board/rps-board.component';


const routes: Routes = [
  { path: 'yieldDashboard', component: YieldDashboardComponent, data: { title: '良率报表' } },
  { path: 'performancetest', component: PerformanceTestComponent, data: { title: '性能测试' } },
  {
    path: 'workshopboard',
    loadChildren: './workshop-board/workshop-board.module#WorkshopBoardModule'
  },
  {
    path: 'rpsboard',
    loadChildren: './rps-board/rps-board.module#RpsBoardModule'
  },
  {
    path: 'adboard',
    loadChildren: './ad-board/ad-board.module#AdBoardModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { 

  

}
