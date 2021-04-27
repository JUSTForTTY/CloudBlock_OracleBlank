import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdBoardComponent } from './ad-board.component';
const routes: Routes = [
  { path: '', component: AdBoardComponent, data: { title: '安灯看板' } },
  { path: 'v1', component: AdBoardComponent, data: { title: '安灯看板' } },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdBoardRoutingModule { }
