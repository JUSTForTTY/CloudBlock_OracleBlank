import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServermanagerComponent } from './servermanager/servermanager.component';

const routes: Routes = [
  { path: 'server', component: ServermanagerComponent, data: { title: '服务器管理' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyblockRoutingModule { }
