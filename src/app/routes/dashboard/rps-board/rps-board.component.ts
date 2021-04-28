import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Data, getTestData, UrlData } from "./datas";
import { fromEvent as observableFromEvent, of as observableOf, Subscription } from 'rxjs';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { RpsBoardService, WorkShop, FactoryCode } from './rps-board.service';
import { orderBy, slice, map, groupBy } from 'lodash';
import { TitleService } from '@delon/theme';
import { environment } from '@env/environment';


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
  nzTimer
  subscription: Subscription;
  ngOnInit() {
    this.rpsBoardService.isFour = false;
    this.rpsBoardService.isFullscreen = false;
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
    this.versionUpdate()
    this.nzTimer = setInterval(() => this.versionUpdate(), 30 * 60 * 1000)
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
  }
  workshopCode = '';
  workShop: WorkShop
  getRouteParam() {
    this.workShop =this.rpsBoardService.getRouteParam(this.route,DefaultTitle);
    this.workshopCode=this.workShop.workShopCode;
  }

  visible(event) {
    if (event.visible) {
      this.rpsBoardService.fullscreen$.next(this.rpsBoardService.isFullscreen);
    }
  }
  version = environment.version;
  versionShow = false;
  versionUpdate() {

    let version = {
    };
    console.log("版本发布-本地", this.version);
    this.http.postHttpAllUrl("http://172.16.8.107/cloudblock_oracle/release/info", version).subscribe((data: any) => {
      console.log("版本发布", data)
      //线上版本大于本地，则提醒升级
      try {
        if (parseInt(data.data.csysReleaseVersion) > parseInt(this.version)) {
          console.log("版本发布-升级", data.data.csysReleaseVersion, this.version)
          // if (!this.versionShow) {
          //   console.log("版本升级弹窗");
          //   this.versionShow = true;
          //   location.reload();
          // }
          location.reload();

        }
      } catch (error) {
        console.error('升级检测error', error);

      }


    }, (err) => {
      console.log("版本发布检测-接口异常");

    });

  }



}

