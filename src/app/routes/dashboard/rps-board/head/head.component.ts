import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpService, PageService } from 'ngx-block-core';



import { RpsBoardService, WorkShop } from "../rps-board.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.less']
})
export class HeadComponent implements OnInit, OnDestroy {
  fontSizeTitle1 = 36;//一级标题
  fontSizeTitle2 = 18;//二级标题
  @Input() workShop: WorkShop
  @Input() title = '工段看板';
  @Input() rpsMode = true;
  @Input() url = "/fullscreen/dashboard/rpsboard/v1";
  @Output() export = new EventEmitter<any>();

  nowTime = Date.now();
  isVisible = false;
  date = new Date()
  dateMode: 'NightShift' | 'DayShift' = 'DayShift';
  dateVisible = false;
  private nowTimeTimer;


  ngModelChange(event) {
    this.rpsBoardService.pageChangeTime$.next(event);
  }
  doExport() {
    this.export.emit();
  }
  constructor(public rpsBoardService: RpsBoardService, private http: HttpService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit() {
    // if (window.screen.height <= 900) {

    // }
    if (this.rpsBoardService.isFour) {
      this.fontSizeTitle1 = 68;//一级标题
      this.fontSizeTitle2 = 36;//二级标题
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
    if (this.rpsMode) {
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
    } else {
      this.router.navigate([this.url], { queryParams: { workshopCode: workShop.workShopCode } })
      setTimeout(() => {
        location.reload();
      }, 50);
    }


  }
  changeMode(now = false) {
    console.log('changeMode')
    if (now) {
      this.rpsBoardService.date = '';
      this.rpsBoardService.dateMode = '';
    } else {
      const date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      const mode = this.dateMode;
      console.log('date', date, mode)
      this.rpsBoardService.date = date;
      this.rpsBoardService.dateMode = mode;
    }
    this.rpsBoardService.historyUrl = `/${this.rpsBoardService.dateMode}/${this.rpsBoardService.date}`;
    this.dateVisible = false;
    this.change(this.workShop, true)
  }

  changeAD() {
    console.log('changeAD')
    this.rpsBoardService.adData.pageAvg = !this.rpsBoardService.adData.pageAvg
  }
  doExportAd() {
    this.http.postHttpAllUrl("http://172.16.8.28:8088/api/getAbInfoBySecOrDept/DownLoadAbFiles", {
      "FactoryCode": this.workShop.workShopCode
    }).subscribe((data: any) => {
      console.log('doExportAd', data)
      if (data.data && data.data.Excelurl) {
        window.open(data.data.Excelurl);
      } else {
      }

    })


  }
}
