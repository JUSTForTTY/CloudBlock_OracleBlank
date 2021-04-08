import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Data, getTestData, UrlData } from "./datas";
import { fromEvent as observableFromEvent, of as observableOf, Subscription } from 'rxjs';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { RpsBoardService, WorkShop, FactoryCode } from './rps-board.service';
import { orderBy, slice, map, groupBy } from 'lodash';
import { TitleService } from '@delon/theme';


const DefaultTitle = ' RPS看板'


@Component({
  selector: 'app-rps-board',
  templateUrl: './rps-board.component.html',
  styleUrls: ['./rps-board.component.less']
})
export class RpsBoardComponent implements OnInit {

  constructor(private http: HttpService,
    private titleSrv: TitleService,
    private route: ActivatedRoute, private pageService: PageService, public rpsBoardService: RpsBoardService) {

  }
  subscription: Subscription;
  ngOnInit() {
    this.getRouteParam();

    this.subscription = this.rpsBoardService.changeWorkShop$.subscribe(data => {
      console.log('changeWorkShop', data)
      if (data.obj.workShopCode === '-1' && data.newObj.workShopCode !== '-1') {
        this.workShop = null;
        setTimeout(() => {
          this.workShop = {
            workShopCode: data.newObj.workShopCode,
            isAdding: false,
            sort: 1
          }
        }, 10);
        this.titleSrv.setTitle(data.newObj.workShopCode + DefaultTitle)

      } else {
        if (data.newObj.workShopCode === '-1') {
          this.titleSrv.setTitle('全厂' + DefaultTitle)
        } else {
          if (!this.rpsBoardService.isFour)
            this.titleSrv.setTitle(data.newObj.workShopCode + DefaultTitle)
        }

      }
    })

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();

  }
  queryParamStr = ""
  workshopCode = '';
  workShop: WorkShop
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
    if (!this.workshopCode) this.workshopCode = '-1';
    console.log('workshopCode,shiftTypeCode', this.workshopCode);
    if (this.workshopCode === '-1') {
      this.rpsBoardService.isFour = true;
      this.titleSrv.setTitle('全厂' + DefaultTitle)
    } else {
      this.titleSrv.setTitle(this.workshopCode + DefaultTitle)

    }
    this.workShop = {
      workShopCode: this.workshopCode,
      isAdding: false,
      sort: 1
    }
  }

  visible(event) {
    if (event.visible) {
      this.rpsBoardService.fullscreen$.next(this.rpsBoardService.isFullscreen);
    }
  }



}

