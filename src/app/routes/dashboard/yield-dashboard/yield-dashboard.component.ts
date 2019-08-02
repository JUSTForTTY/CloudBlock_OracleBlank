
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpService } from 'ngx-block-core';
@Component({
  selector: 'app-yield-dashboard',
  templateUrl: './yield-dashboard.component.html',
  styleUrls: ['./yield-dashboard.component.less']
})
/**
 * 查询产线良率看板，支持传入产线代码进行查询，可以拓展将所有产线进行分批显示
 */
export class YieldDashboardComponent implements OnInit, OnDestroy {

  timer: any;
  currentPageSize = 1;
  dataSet = [];
  dataSetTable = [];
  dataSetGauge = [];

  pageSize = 6;
  constructor(private httpService: HttpService) {
    this.timer = setTimeout(this.setData, 0);
  }

  setData = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.getYieldData();
    this.getYieldAllData();

    this.timer = setTimeout(this.setData, 10000);
  }

  ngOnInit() {


  }

  getYieldData() {

    let bodyData = {
      "tableColumn": [],
      "tableName": "",
      "pageSize": this.pageSize,
      "nowPage": this.currentPageSize,
      "tableSort": [],
      "searchMap": {},
      "deleteFlag": [{ "name": "T_TEST001_FLAG", "value": "0" }], "engineMap": {}
    }

    console.log("报表数据-body", bodyData);

    this.httpService.postHttp("/yieldDashboard/tableData", bodyData).subscribe((data: any) => {


      this.dataSetGauge = [];
      let datahandle = data.data.list;
      datahandle.forEach(element => {

        element.value = element.FLAG1*10;
        this.dataSetGauge.push([element]);

      });

      if (data.data.list.length < this.pageSize) {
        for (let i = 0; i <= this.pageSize - data.data.list.length; i++) {

          data.data.list.push({});

        }
      }
      this.dataSetTable = data.data.list;
      console.log("报表数据", this.dataSetGauge);
      if (this.currentPageSize <= data.data.pageNum) {

        this.currentPageSize++;
      } else {
        this.currentPageSize = 1;
      }



    });

  }
  getYieldAllData() {

    let bodyData = {
      "tableColumn": [],
      "tableName": "",
      "pageSize": 0,
      "nowPage": 0,
      "tableSort": [],
      "searchMap": {},
      "deleteFlag": [{ "name": "T_TEST001_FLAG", "value": "0" }], "engineMap": {}
    }

    console.log("报表数据-body", bodyData);

    this.httpService.postHttp("/yieldDashboard/tableData", bodyData).subscribe((data: any) => {


      this.dataSet = data.data.list;

      console.log("所有数据",data.data.list)

    });

  }
  ngOnDestroy(): void {

  }
}
