import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpsBoardComponent } from './rps-board.component';
import { RpsBoardRoutingModule } from "./rps-board-routing.module";
import { SharedModule } from '@shared/shared.module';
import { RpsTableComponent } from './rps-table/rps-table.component';
import { DomVisibleDirective } from "./dom-visible.directive";
@NgModule({
  declarations: [RpsBoardComponent, RpsTableComponent, DomVisibleDirective],
  imports: [
    CommonModule,
    RpsBoardRoutingModule,
    SharedModule
  ]
})
export class RpsBoardModule { }
