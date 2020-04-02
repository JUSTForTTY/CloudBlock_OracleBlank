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
  workshopName = "abcc";
  @ViewChild('yieldDiv') yieldDiv: ElementRef;
  @ViewChild('yieldDiv2') yieldDiv2: ElementRef;
  @ViewChild('roundDiv') roundDiv: ElementRef;
  @ViewChild('yieldDailydiv') yieldDailydiv: ElementRef;
  @ViewChild('tableDiv') tableDiv: ElementRef;


  yieldDivHeight = 400;
  roundDivHeight$ = new ReplaySubject<number>();
  yieldDailydivHeight$ = new ReplaySubject<number>();
  tableDivHeight$ = new ReplaySubject<number>();
  fontSizeTitle1 = 42;//一级标题
  fontSizeTitle2 = 18;//二级标题

  constructor(private pageService: PageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParam();
    this.autoHeight();
    this.nowTimeTimer = setInterval(() => this.nowTime = Date.now(), 1000)
    console.log(window.screen.height)
    if (window.screen.height <= 900) {
      this.fontSizeTitle1 = 32;//一级标题
      this.fontSizeTitle2 = 16;//二级标题
    }
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
    this.workshopName = this.pageService.getRouteParams(this.route, 'prolineCode', path);
  }
  ngOnDestroy() {
    if (this.nowTimeTimer) {
      clearInterval(this.nowTimeTimer);
    }
  }

}
