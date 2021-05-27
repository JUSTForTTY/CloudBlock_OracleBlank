import { Component, OnInit, Input } from '@angular/core';
import { groupByToJson,CallUserInfo,ErrorInfo,InitErrorData } from "../../utils";

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
