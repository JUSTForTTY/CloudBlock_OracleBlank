import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpsBoardComponent } from './rps-board.component';
import { RpsBoardRoutingModule } from "./rps-board-routing.module";
import { SharedModule } from '@shared/shared.module';
import { RpsTableComponent } from './rps-table/rps-table.component';
import { DomVisibleDirective } from "./dom-visible.directive";
import { HighlightDirective } from "./highlight.directive";
import { RpsBoardService } from "./rps-board.service";
import { ErrorDetailComponent } from './error-detail/error-detail.component';
import { ChangeBgDirective } from "./changBg.directive";
@NgModule({
  declarations: [RpsBoardComponent,ChangeBgDirective, RpsTableComponent, DomVisibleDirective,HighlightDirective, ErrorDetailComponent],
  imports: [
    CommonModule,
    RpsBoardRoutingModule,
    SharedModule
  ],
  providers:[RpsBoardService]
})
export class RpsBoardModule { }
