import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpsBoardComponent } from './rps-board.component';
const routes: Routes = [
  { path: '', component: RpsBoardComponent, data: { title: 'RPS看板' } },
  { path: 'v1', component: RpsBoardComponent, data: { title: 'RPS看板' } },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RpsBoardRoutingModule { }
