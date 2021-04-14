import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RpsMobileComponent } from './rps-mobile.component';
import { RpsMobileRoutingModule } from "../rps-mobile/rps-mobile-routing.module";
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { ListComponent } from './list/list.component';
import { RpsBoardService } from "../../rps-board/rps-board.service";
import { RpsMobileService } from "./rps-mobile.service";
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [RpsMobileComponent, ListComponent],
  imports: [
    RpsMobileRoutingModule,
    NgZorroAntdMobileModule,
    CommonModule, SharedModule
  ],
  providers: [RpsBoardService, RpsMobileService]
})
export class RpsMobileModule { }
