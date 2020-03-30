import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkshopBoardComponent } from './workshop-board.component';
const routes: Routes = [
  { path: '', component: WorkshopBoardComponent, data: { title: '车间看板' } },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopBoardRoutingModule { }
