import { Component, OnInit } from '@angular/core';
import { groupByToJson, CallUserInfo, ErrorInfo, InitErrorData } from "../utils";
import { HttpService, PageService } from 'ngx-block-core';
import { RpsBoardService, WorkShop, FactoryCode } from '../rps-board/rps-board.service';
import { ActivatedRoute } from '@angular/router';

const DefaultTitle="安灯看板"
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
  constructor(private http: HttpService,public rpsBoardService:RpsBoardService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.getErrorData()
    this.getRouteParam()
  }

  getRouteParam() {
    this.workShop =this.rpsBoardService.getRouteParam(this.route,DefaultTitle);
    this.workshopCode=this.workShop.workShopCode;
    if(this.workshopCode==='-1'){
      const url = location.origin + `/fullscreen/dashboard/adboard/v1?workshopCode=SUZ15-1F`;
      location.replace(url);
  
    }

  }

  getErrorData() {
    let factoryCode = '-1';
    if (factoryCode === '-1') factoryCode = '';
    console.log('getAbnormalInfo do', factoryCode)
    // this.http.getHttpAllUrl('http://172.16.8.28:8088/api/getAbnormalInfo?LineCode=SUZ15BE-1').subscribe(
    //   data=>{
    //     console.log('getErrorData SUZ15BE-1', data)
    //   }
    // )

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
        } else {
          this.isError = false
          console.log('getErrorData', data.data.Msg, this.rightData, this.rightShow, this.rightOther)

        }


      }
    )

  }
}
