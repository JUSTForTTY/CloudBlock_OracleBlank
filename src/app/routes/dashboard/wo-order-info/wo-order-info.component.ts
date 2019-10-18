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
  timer: any;
  nzPageSize = 5;
  nzPageIndex = 0;
  nzTotal;
  nzTotalPage;
  currentWoInfo={};


  woWipTableData = [];

  constructor(private httpService: HttpService) {
    this.timer = setTimeout(this.setData, 0);
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

    }


    this.timer = setTimeout(this.setData, 8000);
  }

  ngOnInit() {


    this.getWoWipData();

  }

  getWoWipData() {
    this.httpService.getHttp("/yieldDashboard/woWipData/" + this.prolineCode).subscribe((woWipData: any) => {

      this.woWipTableData = woWipData.data;
      console.log("在制工单数据", this.woWipTableData)
      this.currentWoInfo = this.woWipTableData[this.nzPageIndex];
    });

  }

  woWipDataTransform() {


  }
  ngOnDestroy(): void {
    clearInterval(this.timer);

  }

}
