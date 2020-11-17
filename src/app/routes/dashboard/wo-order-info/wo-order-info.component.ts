import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
@Component({
  selector: 'app-wo-order-info',
  templateUrl: './wo-order-info.component.html',
  styleUrls: ['./wo-order-info.component.less']
})
export class WoOrderInfoComponent implements OnInit, OnDestroy {

  @Input() dataSet = [];
  @Input() prolineCode;
  @Input() prolineType;
  timer: any;
  wiptimer: any;
  nzPageSize = 5;
  nzPageIndex = 0;
  nzTotal;
  nzTotalPage;
  currentWoInfo = {
    "woCode": "无",
    "productCode": "无",
    "planNumber": "无",
    "inputNumber": "无",
    "produceNumber": "无",
    "smtWoState": "无",
  };


  woWipTableData = [];

  constructor(private httpService: HttpService) {
    this.timer = setTimeout(this.setData, 0);
    this.wiptimer = setTimeout(this.getWipData, 0);
  }

  setData = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.woWipTableData.length > 0) {
      if (this.nzPageIndex < this.woWipTableData.length - 1) {
        this.nzPageIndex++;
      } else {
        this.nzPageIndex = 0;
      }
      this.currentWoInfo = this.woWipTableData[this.nzPageIndex];

    } else {

      this.currentWoInfo = {
        "woCode": "无",
        "productCode": "无",
        "planNumber": "无",
        "inputNumber": "无",
        "produceNumber": "无",
        "smtWoState": "无",
      };
    }


    this.timer = setTimeout(this.setData, 8000);
  }

  getWipData = () => {
    if (this.wiptimer) {
      clearTimeout(this.wiptimer);
    }

    this.getWoWipData();

    this.wiptimer = setTimeout(this.getWipData, 10 * 60 * 1000);
  }


  ngOnInit() {


    this.getWoWipData();

  }

  getWoWipData() {
    this.httpService.getHttp("/yieldDashboard/woWipData/" + this.prolineCode + "?prolineType=" + this.prolineType).subscribe((woWipData: any) => {

      this.woWipTableData = woWipData.data;
      console.log("产线报表-在制工单数据", this.woWipTableData)
      if (this.woWipTableData.length > 0) {
        this.currentWoInfo = this.woWipTableData[this.nzPageIndex];
      }

    }, (err) => {
      console.log("看板数据-接口异常");

    });

  }

  woWipDataTransform() {


  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
    clearInterval(this.wiptimer);


  }

}
