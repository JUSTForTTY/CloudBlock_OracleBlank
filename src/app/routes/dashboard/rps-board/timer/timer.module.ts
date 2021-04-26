import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "@shared";
import { TimerComponent } from "./timer.component";
@NgModule({
  declarations: [TimerComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[TimerComponent]
})
export class TimerModule { }
