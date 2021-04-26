import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { groupByToJson,CallUserInfo,ErrorInfo,InitErrorData } from "../../utils";

@Component({
  selector: 'app-error-item',
  templateUrl: './error-item.component.html',
  styleUrls: ['./error-item.component.less']
})
export class ErrorItemComponent implements OnInit {
  @Input() item: ErrorInfo;
  @Output() showErrorDetail = new EventEmitter<ErrorInfo>();
  constructor() { }

  ngOnInit() {
  }
  clickItem(){
    this.showErrorDetail.emit(this.item)
  }

}
