import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';



import { RpsBoardService, WorkShop } from "../rps-board.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.less']
})
export class HeadComponent implements OnInit, OnDestroy {
  fontSizeTitle1 = 42;//一级标题
  fontSizeTitle2 = 24;//二级标题
  @Input() workShop: WorkShop
  @Input() title = '工段看板';
  @Input() showRight = true;
  @Input() url = "/fullscreen/dashboard/rpsboard/v1";
  nowTime = Date.now();
  isVisible = false;
  date = new Date()
  dateMode: '夜班' | '白班' = '白班';
  dateVisible = false;
  private nowTimeTimer;


  ngModelChange(event) {
    this.rpsBoardService.pageChangeTime$.next(event);
  }
  constructor(public rpsBoardService: RpsBoardService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit() {
    if (window.screen.height <= 900) {
      this.fontSizeTitle1 = 32;//一级标题
      this.fontSizeTitle2 = 18;//二级标题
    }
    this.nowTimeTimer = setInterval(() => this.nowTime = Date.now(), 1000)

  }


  ngOnDestroy() {
    if (this.nowTimeTimer) {
      clearInterval(this.nowTimeTimer);
    }

  }
  showChange() {
    if (this.rpsBoardService.isFour) {
      return;
    }
    this.isVisible = true;
  }
  change(workShop: WorkShop, force = false) {
    console.log('change changeWorkShop', this.workShop, workShop)
    if (this.workShop.workShopCode === workShop.workShopCode && !force) return;
    this.router.navigate([this.url], { queryParams: { workshopCode: workShop.workShopCode } })
    // return;
    if (workShop.workShopCode === '-1') {
      this.rpsBoardService.isFour = true;
    } else {
      this.rpsBoardService.isFour = false;
    }
    this.rpsBoardService.changeWorkShop$.next({
      obj: this.workShop,
      newObj: workShop,
      force: force
    })
    this.isVisible = false;
    // TODO

  }
  changeMode() {
    const date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    const mode = this.dateMode;
    console.log('date', date, mode)
    this.rpsBoardService.date = date;
    this.rpsBoardService.dateMode = mode;
    this.dateVisible = false;
    this.change(this.workShop, true)
  }

}
