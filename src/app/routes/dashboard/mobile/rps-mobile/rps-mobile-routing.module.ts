import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RpsMobileComponent } from './rps-mobile.component';
import { SelectComponent } from "./select/select.component";
const routes: Routes = [
  { path: '', redirectTo: 'select',pathMatch:'full' },

  { path: 'v1', component: RpsMobileComponent, data: { title: 'RPS看板' } },
  { path: 'select', component: SelectComponent, data: { title: '选择车间' } },


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RpsMobileRoutingModule { }
