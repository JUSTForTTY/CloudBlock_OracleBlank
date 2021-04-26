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
// import { ChangeBgDirective } from "./changBg.directive";
import { RpsBlockComponent } from './rps-block/rps-block.component';
import { HeadComponent } from './head/head.component';
import { TimerComponent } from './timer/timer.component';
import { ErrorItemModule } from "./error-item/error-item.module";
import { TimerModule } from "./timer/timer.module";
@NgModule({
  declarations: [RpsBoardComponent, RpsTableComponent, DomVisibleDirective,HighlightDirective, ErrorDetailComponent, RpsBlockComponent, HeadComponent],
  imports: [
    CommonModule,
    RpsBoardRoutingModule,
    SharedModule,
    ErrorItemModule,
    TimerModule
  ],
  providers:[RpsBoardService]
})
export class RpsBoardModule { }
