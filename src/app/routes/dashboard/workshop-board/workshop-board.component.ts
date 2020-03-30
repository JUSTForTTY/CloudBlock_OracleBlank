import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent as observableFromEvent, of as observableOf } from 'rxjs';
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
  yieldDivHeight = 400;
  constructor(private pageService: PageService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParam();
    this.autoHeight();
    this.nowTimeTimer = setInterval(() => this.nowTime = Date.now(), 1000)


  }
  /**
   * 自动设置图表高度
   */
  autoHeight() {
    setTimeout(() => {
      this.yieldDivHeight = this.yieldDiv.nativeElement.offsetHeight - 10;
      console.log('yieldDivHeight1', this.yieldDivHeight)
    }, 10);
    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        this.yieldDivHeight = this.yieldDiv.nativeElement.offsetHeight - 10;
        console.log('yieldDivHeight2', this.yieldDivHeight)

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
