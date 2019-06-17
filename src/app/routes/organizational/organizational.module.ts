import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OrganizationalRoutingModule } from './organizational-routing.module';
import { ManagercenterComponent } from './managercenter/managercenter.component';
import { OrganizationalmanagerComponent } from './organizationalmanager/organizationalmanager.component';
import { RolemanagerComponent } from './rolemanager/rolemanager.component';
import { OrganizationalchartComponent } from './organizationalmanager/organizationalchart/organizationalchart.component';
import { RolememberComponent } from './rolemanager/rolemember/rolemember.component';
import { RolemenuComponent } from './rolemanager/rolemenu/rolemenu.component';
import { RolepageComponent } from './rolemanager/rolepage/rolepage.component';
import { DepartmentmanagerComponent } from './departmentmanager/departmentmanager.component';

@NgModule({
  imports: [
    CommonModule,
    OrganizationalRoutingModule,SharedModule,NgxGraphModule,NgxChartsModule
  ],
  declarations: [ManagercenterComponent, OrganizationalmanagerComponent, RolemanagerComponent, OrganizationalchartComponent, RolememberComponent, RolemenuComponent, RolepageComponent, DepartmentmanagerComponent]
})
export class OrganizationalModule { }
