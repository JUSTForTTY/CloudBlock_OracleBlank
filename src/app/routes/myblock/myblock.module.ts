import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MyblockRoutingModule } from './myblock-routing.module';
import { ServermanagerComponent } from './servermanager/servermanager.component';

@NgModule({
  declarations: [ServermanagerComponent],
  imports: [
    CommonModule,
    MyblockRoutingModule,SharedModule
  ]
})
export class MyblockModule { }
