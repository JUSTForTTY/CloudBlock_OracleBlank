
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

const resource_url=environment.RESOURCE_SERVER_URL;
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
  usertimer: any;
  currentPageSize = 1;
  dataSet = [];
  dataSetTable = [];
  dataSetGauge = [];
  //班组信息
  shiftInfo = [];
  //领班
  userData_foreman = [];
  //领班头像
  foremanHeadimage;
  //pe技术员
  userData_pe = [];
  //te技术员
  userData_te = [];
  //qa技术员
  userData_qa = [];
  //员工
  userData_worker = [];
  //在岗人数
  onDuty;
  //员工-分组显示
  userGroupData = [];
  currentGroupIndex = 0;
  //员工-分组显示
  currentGroupData = [];

  resource_url=resource_url;

  userData = ['PE:张三', 'QE:李四', 'IT:王二', 'QC:小明', '操作员:小李'];
  currentUser;
  path;
  prolineCode;
  pageSize = 6;
  constructor(private httpService: HttpService, private pageService: PageService, private route: ActivatedRoute) {
    this.timer = setTimeout(this.setData, 0);
    this.usertimer = setTimeout(this.getCurrentUserGroup, 0);
  }

  setData = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // this.getYieldData();
    // this.getYieldAllData();
    this.getShiftData();
    this.timer = setTimeout(this.setData, 60000);
  }

  getCurrentUserGroup = () => {
    if (this.usertimer) {
      clearTimeout(this.usertimer);
    }
    if (this.userGroupData.length > 0) {
      if (this.currentGroupIndex < this.userGroupData.length - 1) {
        this.currentGroupIndex++;
      } else {
        this.currentGroupIndex = 0;
      }

      this.currentGroupData = this.userGroupData[this.currentGroupIndex];
    }


    this.usertimer = setTimeout(this.getCurrentUserGroup, 6000);
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

        element.value = element.FLAG1 * 10;
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

      console.log("所有数据", data.data.list)

    });

  }
  getShiftData() {

    this.httpService.getHttp("/yieldDashboard/shiftData/" + this.prolineCode).subscribe((shiftData: any) => {

      console.log("产线班组数据", shiftData);
      if (shiftData.data.foreman.length > 0) {
        this.userData_foreman = shiftData.data.foreman;
      }
      if (shiftData.data.pe.length > 0) {
        this.userData_pe = shiftData.data.pe;
      }
      if (shiftData.data.te.length > 0) {
        this.userData_te = shiftData.data.te;
      }
      if (shiftData.data.qa.length > 0) {
        this.userData_qa = shiftData.data.qa;
      }
      this.userData_worker = shiftData.data.worker;
      this.shiftInfo = shiftData.data.shiftData;
      if(null!=shiftData.data.foremanHeadimage&&shiftData.data.foremanHeadimage!=""){
        this.foremanHeadimage=this.resource_url+shiftData.data.foremanHeadimage;

      }
       
      this.onDuty = this.userData_foreman.length + this.userData_pe.length + this.userData_te.length + this.userData_qa.length + this.userData_worker.length;

      this.shiftDataTransfer();
    });

    //this.currentUser=this.userData[Math.floor((Math.random()*this.userData.length))];

  }
  shiftDataTransfer() {


    let userData = this.userData_worker;
    let newUserData = [];
    if (userData.length <= 3) {
      newUserData.push(userData.slice(0, userData.length));


    } else {

      console.log("用户数据", userData);
      for (var i = 0; i < userData.length; i += 3) {
        newUserData.push(userData.slice(i, i + 3));
      }

    }

    this.userGroupData = newUserData;

    this.currentGroupData = this.userGroupData[this.currentGroupIndex];

    console.log("用户组数据", this.userGroupData);

  }


  ngOnDestroy(): void {
    clearInterval(this.timer);
    clearInterval(this.usertimer);


  }
}
