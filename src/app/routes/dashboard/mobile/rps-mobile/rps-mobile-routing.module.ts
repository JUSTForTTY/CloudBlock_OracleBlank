import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpsMobileComponent } from './rps-mobile.component';
const routes: Routes = [
  { path: '', component: RpsMobileComponent, data: { title: 'RPS看板' } },
  { path: 'v1', component: RpsMobileComponent, data: { title: 'RPS看板' } },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RpsMobileRoutingModule { }
