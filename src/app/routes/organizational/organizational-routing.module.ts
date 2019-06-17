import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagercenterComponent } from './managercenter/managercenter.component';
import { OrganizationalmanagerComponent } from './organizationalmanager/organizationalmanager.component';
import { RolemanagerComponent } from './rolemanager/rolemanager.component';
import { OrganizationalchartComponent } from './organizationalmanager/organizationalchart/organizationalchart.component';
import { RolememberComponent } from './rolemanager/rolemember/rolemember.component';
import { RolepageComponent } from './rolemanager/rolepage/rolepage.component';
import { DepartmentmanagerComponent } from './departmentmanager/departmentmanager.component';
const routes: Routes = [
  { path: 'managercenter', component: ManagercenterComponent, data: { title: '组织权限' } },
  { path: 'organizationalmanager', component: OrganizationalmanagerComponent, data: { title: '组织架构' } },
  { path: 'organizationalchart', component: OrganizationalchartComponent, data: { title: '组织变更' } },
  { path: 'rolemanager', component: RolemanagerComponent, data: { title: '权限管理' } },
  { path: 'rolemember', component: RolememberComponent, data: { title: '用户组成员' } },
  { path: 'rolepage', component: RolepageComponent, data: { title: '用户组权限' } },
  { path: 'departmentmanager', component: DepartmentmanagerComponent, data: { title: '部门管理' } },
  { path: 'organizationalchart', component: OrganizationalchartComponent, data: { title: '组织架构流图' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationalRoutingModule { }
