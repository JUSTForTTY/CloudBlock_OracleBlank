import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import {  CallUserInfo, ErrorInfo, InitErrorData } from "../utils";

@Component({
  selector: 'app-proline-errormsg',
  templateUrl: './proline-errormsg.component.html',
  styleUrls: ['./proline-errormsg.component.less']
})
export class ProlineErrormsgComponent implements OnInit, OnDestroy {
  @Input() prolineCode;
  timer: any;
  ertimer: any;
  loading = false;
  prolineErrorData = [];
  prolineErrorResult = [];
  nzPageSize = 3;
  nzPageIndex = 0;
  nzTotal;
  nzTotalPage;
  mesType = {
    0: "人", 1: "机", 2: "料", 3: "法", 4: "环"
  }
  mesrange = {
    1: "计划内", 2: "计划外"
  }
  data = [
    {
      title: '产线异常信息 1'
    },
    {
      title: '产线异常信息 2'
    },
    {
      title: '产线异常信息 3'
    },
    {
      title: '产线异常信息 4'
    },
    {
      title: '产线异常信息 5'
    }
  ];
  constructor(private httpService: HttpService) {
    this.timer = setTimeout(this.setData, 0);
    this.ertimer = setTimeout(this.setPageData, 0);
  }

  setData = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.getErrorData();

    this.timer = setTimeout(this.setData, 1 * 60 * 1000);
  }
  setPageData = () => {
    if (this.ertimer) {
      clearTimeout(this.ertimer);
    }
    console.log("分页检测：",this.nzPageIndex);
    console.log("分页检测：",this.nzTotalPage);
    console.log("分页检测：",this.prolineErrorResult);
    if (this.nzPageIndex < this.nzTotalPage-1) {
      this.nzPageIndex++;
      this.prolineErrorData = this.prolineErrorResult[this.nzPageIndex];
    } else {
      this.nzPageIndex = 0;
      this.prolineErrorData = this.prolineErrorResult[this.nzPageIndex];
    }

    this.ertimer = setTimeout(this.setPageData, 10000);
  }
  ngOnInit() {

    this.getErrorData();
  }

  //获取产线异常信息
  rightData: ErrorInfo[] = []
  getErrorData() {

    console.log("产线报表-异常查询")
    this.httpService.getHttp("/yieldDashboard/errorData/" + this.prolineCode).subscribe((errorData: any) => {

      console.log("产线报表-异常信息产线", errorData);
      this.prolineErrorData = errorData.data;
      console.log("产线报表-异常信息", this.prolineErrorData);

      this.errorDataTransform();

    }, (err) => {
      console.log("看板数据-接口异常");

    });
      this.httpService.getHttpAllUrl('http://172.16.8.28:8088/api/getAbnormalInfo?LineCode='+this.prolineCode).subscribe(
      data=>{
        console.log('getErrorData '+this.prolineCode, data)
        if (data.data.ErrorCode === 0) {
          this.rightData = data.data.CallInfo;
          // console.log('getErrorData', data.data.CallInfo)

          InitErrorData(this.rightData, data.data.CallUserInfo)
          console.log('errorData', this.rightData)
          this.rightData=this.rightData.filter(data=> data.status!=='success')

        } else {
          this.rightData=[];

        }
      }
    )

  }
  errorDataTransform() {

    let prolineErrorDatalength = this.prolineErrorData.length;
    this.nzTotalPage = Math.ceil(prolineErrorDatalength / this.nzPageSize);

    this.prolineErrorResult = [];

    for (var i = 0; i < prolineErrorDatalength; i += 3) {
      this.prolineErrorResult.push(this.prolineErrorData.slice(i, i + 3));
    }
    this.prolineErrorData = this.prolineErrorResult[this.nzPageIndex];

  }

  ngOnDestroy(): void {



  }

}
