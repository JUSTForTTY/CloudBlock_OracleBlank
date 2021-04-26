import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorItemComponent } from './error-item.component';
import { SharedModule } from "@shared";
import { ChangeBgDirective } from "../changBg.directive";
import { TimerModule } from "../timer/timer.module";

@NgModule({
  declarations: [ErrorItemComponent, ChangeBgDirective],
  imports: [
    CommonModule,
    SharedModule,
    TimerModule
  ], exports: [ErrorItemComponent,ChangeBgDirective]
})
export class ErrorItemModule { }
