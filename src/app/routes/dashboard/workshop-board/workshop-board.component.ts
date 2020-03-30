import { Component, OnInit } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-workshop-board',
  templateUrl: './workshop-board.component.html',
  styleUrls: ['./workshop-board.component.less']
})
export class WorkshopBoardComponent implements OnInit {
  //时间定时器
  private nowTimeTimer;
  nowTime= Date.now();
  workshopName="abcc";
  constructor(private pageService:PageService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParam();
    this.nowTimeTimer = setInterval(() => this.nowTime= Date.now(), 1000)
  }
  queryParamStr=""
  getRouteParam(){
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
