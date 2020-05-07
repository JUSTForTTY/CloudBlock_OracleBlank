import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent as observableFromEvent, of as observableOf } from 'rxjs';
import { ReplaySubject, Subscription } from 'rxjs';
@Component({
  selector: 'app-workshop-board',
  templateUrl: './workshop-board.component.html',
  styleUrls: ['./workshop-board.component.less']
})
export class WorkshopBoardComponent implements OnInit {
  //时间定时器
  private nowTimeTimer;
  nowTime = Date.now();
  workshopCode = "SUZ21-2F";
  shiftTypeCode = "2Shfit";
  @ViewChild('yieldDiv') yieldDiv: ElementRef;
  @ViewChild('yieldDiv2') yieldDiv2: ElementRef;
  @ViewChild('roundDiv') roundDiv: ElementRef;
  @ViewChild('yieldDailydiv') yieldDailydiv: ElementRef;
  @ViewChild('tableDiv') tableDiv: ElementRef;


  yieldDivHeight = 400;
  yieldDivHeight$ = new ReplaySubject<number>();
  roundDivHeight$ = new ReplaySubject<number>();
  yieldDailydivHeight$ = new ReplaySubject<number>();
  tableDivHeight$ = new ReplaySubject<number>();
  fontSizeTitle1 = 42;//一级标题
  fontSizeTitle2 = 18;//二级标题

  //传送数据
  leftData$ = new ReplaySubject<any>();

  constructor(private pageService: PageService, private route: ActivatedRoute, private http: HttpService) { }
  //定时器
  private nzLeftTimer;

  ngOnInit() {
    this.getRouteParam();
    this.autoHeight();
    this.nowTimeTimer = setInterval(() => this.nowTime = Date.now(), 1000)
    console.log(window.screen.height)
    if (window.screen.height <= 900) {
      this.fontSizeTitle1 = 32;//一级标题
      this.fontSizeTitle2 = 16;//二级标题
    }
    if (this.nzLeftTimer) {
      clearInterval(this.nzLeftTimer);
    }
    this.getLeftData();
    this.nzLeftTimer = setInterval(() => {
      this.getLeftData();
    }, 60 * 1000)

  }
  /**
   * 获取看板左侧两块的数据
   */
  getLeftData() {
    //获取报警阀值

    this.http.getHttp("/yieldDashboard/workshopAlarmSettingData/" + this.workshopCode + "/" + this.shiftTypeCode).subscribe((alarmSettingData: any) => {
      console.log('yield-workshopAlarmSettingData', alarmSettingData)
      //获取数据
      this.http.getHttp("/yieldDashboard/workshopYeildData/" + this.workshopCode + "/" + this.shiftTypeCode).subscribe((yeildData: any) => {
        const leftData = {
          alarmSettingData: alarmSettingData,
          yeildData: yeildData
        }
        console.log('yield-leftData', leftData)
        this.leftData$.next(leftData)
      });
    });

  }
  /**
   * 自动设置图表高度,自适应字体大小
   */
  autoHeight() {
    setTimeout(() => {
      this.yieldDivHeight = this.yieldDiv.nativeElement.offsetHeight - 10 - this.yieldDiv2.nativeElement.offsetHeight;

      console.log('yieldDivHeight1', this.yieldDivHeight)
      console.log('roundDivHeight1', this.roundDiv.nativeElement.offsetHeight)
      console.log('yieldDailydivHeight1', this.yieldDailydiv.nativeElement.offsetHeight * 0.872 - 10)
      console.log('tableDivHeight1', this.tableDiv.nativeElement.offsetHeight)
      this.yieldDivHeight$.next(this.yieldDivHeight);
      this.roundDivHeight$.next(this.roundDiv.nativeElement.offsetHeight);
      this.yieldDailydivHeight$.next(this.yieldDailydiv.nativeElement.offsetHeight * 0.872 - 10);
      this.tableDivHeight$.next(this.tableDiv.nativeElement.offsetHeight);
    }, 10);
    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        if (window.innerHeight <= 900) {
          this.fontSizeTitle1 = 32;//一级标题
          this.fontSizeTitle2 = 16;//二级标题
        } else {
          this.fontSizeTitle1 = 42;//一级标题
          this.fontSizeTitle2 = 18;//二级标题
        }
        this.yieldDivHeight = this.yieldDiv.nativeElement.offsetHeight - 10 - this.yieldDiv2.nativeElement.offsetHeight;
        this.yieldDivHeight$.next(this.yieldDivHeight);
        console.log('window.innerHeight', window.innerHeight)
        console.log('yieldDivHeight2', this.yieldDivHeight)
        console.log('roundDivHeight2', this.roundDiv.nativeElement.offsetHeight)
        console.log('yieldDailydivHeight2', this.yieldDailydiv.nativeElement.offsetHeight * 0.872 - 10)
        console.log('tableDivHeight2', this.tableDiv.nativeElement.offsetHeight)
        this.roundDivHeight$.next(this.roundDiv.nativeElement.offsetHeight);
        this.yieldDailydivHeight$.next(this.yieldDailydiv.nativeElement.offsetHeight * 0.872 - 10);
        this.tableDivHeight$.next(this.tableDiv.nativeElement.offsetHeight);

      });
  }
  queryParamStr = ""

  getRouteParam() {
    let path = this.pageService.getPathByRoute(this.route);
    //监听路径参数
    this.pageService.setRouteParamsByRoute(this.route, path);
    //初始化参数识别字串
    this.queryParamStr = '';
    for (const key in this.pageService.routeParams[path]) {
      if (this.pageService.routeParams[path].hasOwnProperty(key)) {
        this.queryParamStr = this.queryParamStr + this.pageService.routeParams[path][key];
      }
    }
    //  path 可不传
    //  this.activatedRoute 需保证准确
    this.workshopCode = this.pageService.getRouteParams(this.route, 'workshopCode', path);
    this.shiftTypeCode = this.pageService.getRouteParams(this.route, 'shiftTypeCode', path);
    if (!this.shiftTypeCode || this.shiftTypeCode === '') this.shiftTypeCode = '2Shfit';
    console.log('workshopCode,shiftTypeCode', this.workshopCode, this.shiftTypeCode);

  }
  ngOnDestroy() {
    if (this.nowTimeTimer) {
      clearInterval(this.nowTimeTimer);
    }
    if (this.nzLeftTimer) {
      clearInterval(this.nzLeftTimer);
    }
  }

}
