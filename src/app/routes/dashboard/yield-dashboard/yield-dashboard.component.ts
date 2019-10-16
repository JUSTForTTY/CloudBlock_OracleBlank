
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpService,PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
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
  userData=['PE:张三','QE:李四','IT:王二','QC:小明','操作员:小李'];
  currentUser;
  path;
  prolineCode;
  pageSize = 6;
  constructor(private httpService: HttpService,private pageService: PageService,private route: ActivatedRoute) {
    this.timer = setTimeout(this.setData, 0);
  }

  setData = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // this.getYieldData();
    // this.getYieldAllData();
    this.getUser();
    this.timer = setTimeout(this.setData, 3000);
  }


  ngOnInit() {
    this.path = this.pageService.getPathByRoute(this.route);
    //  path 可不传
    //  this.activatedRoute 需保证准确
    this.prolineCode = this.pageService.getRouteParams(this.route, 'prolineCode', this.path);



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
  getUser(){

    this.currentUser=this.userData[Math.floor((Math.random()*this.userData.length))];

  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
     
  }
}
