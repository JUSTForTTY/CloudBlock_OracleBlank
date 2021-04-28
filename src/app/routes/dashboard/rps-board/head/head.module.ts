import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HeadComponent } from "./head.component";
@NgModule({
  declarations: [HeadComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [HeadComponent]
})
export class HeadModule { }
