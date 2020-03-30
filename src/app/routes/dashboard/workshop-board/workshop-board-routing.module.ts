import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { YieldProductlineComponent } from "./yield-productline/yield-productline.component";
const routes: Routes = [
  { path: '', component: YieldProductlineComponent, data: { title: '车间看板' } },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopBoardRoutingModule { }
