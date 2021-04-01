import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-error-detail',
  templateUrl: './error-detail.component.html',
  styleUrls: ['./error-detail.component.less']
})
export class ErrorDetailComponent implements OnInit {
  @Input() currentErrorInfo:ErrorInfo;
  constructor() { }

  ngOnInit() {
  }

}

interface ErrorInfo {
  "FBillNo": string;
  "FLocation": string;
  "FReason": string;
  "FCallDate": string;
  "FCallUser": string;
  "FCallUserName": string;
  "FRespUser": string;
  "FRespUserName": string;
  "FMaintUserCode": string;
  "FMaintUserName": string;
  "FRespDate": number;
  "FMaintDate": number;
  "FStopLineDate": number;
  "FactoryCode": string;
  "FState": '已维修' | '已关闭' | '待响应' | '已响应';
  index?: number;
  status?: string;
  callUserInfo?: CallUserInfo[]

}
interface CallUserInfo {
  /** 姓名 */
  A0101: string;
  FBillNo: string;
  FDate: string;
  FUserCode: string;
}