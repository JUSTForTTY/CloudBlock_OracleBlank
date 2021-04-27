import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdBoardComponent } from './ad-board.component';
import { AdBoardRoutingModule } from "./ad-board-routing.module";
import { SharedModule } from "@shared";

@NgModule({
  declarations: [AdBoardComponent],
  imports: [
    CommonModule,
    AdBoardRoutingModule,
    SharedModule
  ]
})
export class AdBoardModule { }
