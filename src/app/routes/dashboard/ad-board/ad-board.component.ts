import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { groupByToJson, CallUserInfo, ErrorInfo, InitErrorData } from "../utils";
import { HttpService, PageService } from 'ngx-block-core';
import { RpsBoardService, WorkShop, FactoryCode } from '../rps-board/rps-board.service';
import { ActivatedRoute } from '@angular/router';

const DefaultTitle = "安灯看板"
@Component({
  selector: 'app-ad-board',
  templateUrl: './ad-board.component.html',
  styleUrls: ['./ad-board.component.less']
})
export class AdBoardComponent implements OnInit {
  rightShow: ErrorInfo[] = [];
  rightOther: ErrorInfo[] = [];
  rightData: ErrorInfo[] = []
  isError = false;
  workshopCode = '';
  workShop: WorkShop;
  private errorTimer;
  private rightTimer;


  constructor(private http: HttpService, public rpsBoardService: RpsBoardService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getRouteParam()
    this.autoSize()
    this.getErrorData()

    if (this.errorTimer) {
      clearInterval(this.errorTimer);
    }
    if (this.rightTimer) {
      clearInterval(this.rightTimer);
    }
    this.errorTimer = setInterval(() => {
      this.versionUpdate();
      this.getErrorData();
    }, 120 * 1000)
    let index = 0
    this.rightTimer = setInterval(() => {
      index++;
      this.changePage(this.rightData, this.nzPageSize);
      if (index % 4===0) {
        this.rpsBoardService.adData.pageAvg = !this.rpsBoardService.adData.pageAvg;
      }
    }, 25 * 1000)



  }

  getRouteParam() {
    this.workShop = this.rpsBoardService.getRouteParam(this.route, DefaultTitle);
    this.workshopCode = this.workShop.workShopCode;
    if (this.workshopCode === '-1') {
      const url = location.origin + `/fullscreen/dashboard/adboard/v1?workshopCode=SUZ15-1F`;
      location.replace(url);

    }

  }

  getErrorData() {
    // this.http.getHttpAllUrl('http://172.16.8.28:8088/api/getAbnormalInfo?LineCode=SUZ15BE-1').subscribe(
    //   data=>{
    //     console.log('getErrorData SUZ15BE-1', data)
    //   }
    // )
    let factoryCode = FactoryCode[this.workshopCode];
    if (!factoryCode) factoryCode = this.workshopCode;
    if (factoryCode === '-1') factoryCode = '';
    console.log('getAbnormalInfo do', factoryCode)

    this.http.postHttpAllUrl('http://172.16.8.28:8088/api/getAbnormalInfo', { FactoryCode: factoryCode }).subscribe(
      (data: {
        data: { CallInfo: ErrorInfo[], CallUserInfo: CallUserInfo[], ErrorCode: number, Msg?: string }
      }) => {
        console.log('getErrorData', data)
        if (data.data.ErrorCode === 0) {
          this.rightData = data.data.CallInfo;
          // console.log('getErrorData', data.data.CallInfo)

          this.isError = InitErrorData(this.rightData, data.data.CallUserInfo)
          console.log('errorData', this.rightData)
          setTimeout(() => {
            this.changeSize()
          }, 10);
        } else {
          this.isError = false
          console.log('getErrorData', data.data.Msg, this.rightData, this.rightShow, this.rightOther)

        }


      }
    )

  }

  visible(event, item, index) {
    this.rpsBoardService.visible(event, item, index, this.rightShow, this.rightOther)

  }
  @ViewChild('errorBox') errorBox: ElementRef;
  errorIconSize = 60;
  nzPageSize = 1;
  @ViewChild('errodHead') errodHead: ElementRef;
  changeSize() {
    const errorListHeight = this.errorBox.nativeElement.clientHeight - this.errodHead.nativeElement.clientHeight

    const pagesize = Math.floor(errorListHeight / (210 + 5) + 0.05)
    console.log('errorBox', this.errorBox.nativeElement.clientHeight, this.errodHead.nativeElement.clientHeight, errorListHeight, pagesize)

    this.nzPageSize = pagesize;
    this.changePage(this.rightData, this.nzPageSize, true);
  }
  initDatas() {
    this.rightOther = [...this.rightData];
    this.rightShow = [];

  }
  async changePage(allData: ErrorInfo[], size: number, init: boolean = false) {

    if (init) {
      this.initDatas()
    }

    let rightShow: ErrorInfo[] = []
    if (allData.length === 0) {
      return;
    }

    if (size >= allData.length) {
      rightShow = [...allData];
      this.rightShow = rightShow;
      return;
    }

    const ToRight: ErrorInfo[] = []
    for (const iterator of this.rightShow) {
      ToRight.push(iterator)
    }
    let addNumber = 0;
    for (const iterator of this.rightOther) {
      rightShow.push(iterator);
      addNumber++;
      if (addNumber === size) {
        break;
      }
    }
    this.rightOther.splice(0, size);
    // ToRight.sort((a, b) => a.index - b.index);

    for (const iterator of ToRight) {
      this.rightOther.push(iterator);
    }
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    //  TODO 残缺补全
    // }
    this.rightShow = rightShow;
    // this.rightShow.sort((a, b) => a.sort - b.sort);
  }

  autoSize() {
    observableFromEvent(window, 'resize')
      .subscribe((event) => {

        setTimeout(() => {
          this.changeSize()
        }, 10);

      });
  }
  ngOnDestroy() {

    if (this.errorTimer) {
      clearInterval(this.errorTimer);
    }
    if (this.rightTimer) {
      clearInterval(this.rightTimer);
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
import { fromEvent as observableFromEvent, of as observableOf, Subscriber, Subscription } from 'rxjs';
import { environment } from '@env/environment';
