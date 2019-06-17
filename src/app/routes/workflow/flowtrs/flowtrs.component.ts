import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as shape from 'd3-shape';
import * as graph from '@swimlane/ngx-graph';
import { HttpService } from 'ngx-block-core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { equalSegments } from '@angular/router/src/url_tree';
import { NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'app-flowtrs',
  templateUrl: './flowtrs.component.html',
  styleUrls: ['./flowtrs.component.less']
})
export class FlowtrsComponent implements OnInit {
  constructor(private fb: FormBuilder, private http: _HttpClient, public msg: NzMessageService, private httpService: HttpService,
    private router: Router, private modalService: NzModalService, private cacheService: CacheService) { }

  form: FormGroup;
  avatar = 'assets/img/workflow.png';
  totalRecords = 0;
  currentPage = 1;
  project_desc = "";
  url = "/csyspotgroup/listCondition?size=5";
  q: any = {
    status: 'progress',//默认选中进行中
  };
  loading = false;
  data: any[] = [];
  isVisible = false;
  isOkLoading = false;
  workflowUrl = "/csyspotgroup";
  title = "";
  total = "";
  searchContent = "";
  searchData;
  isSpinning = false;
  public ngOnInit(): void {
    this._getWorkFlowListData(this.currentPage);
    this.getFlowGroup();
    this.init();
    this.getPot();
  }

  init() {
    this.form = this.fb.group({
      flowGrpupName: [null, [Validators.required]],
      workFlowGroup: [null, []],
      workFlowDesc: [null, []]
    });
  }

  pageId = 1;
  //获取途程数据
  _getWorkFlowListData(currentPage: number) {
    this.pageId = currentPage;
    this.loading = true;
    this.httpService.postHttp(this.url + "&page=" + currentPage).subscribe((data: any) => {
      this.totalRecords = data.data.total;
      this.total = data.data.total;
      this.currentPage = currentPage;
      this.data = data.data.list;
      this.searchData = data.data.list;//用于搜索列表
      this.loading = false;
      console.log("pagedata", this.data);
    });
  }

  //搜索途程
  serchWorkFlow(): void {
    let temporayArray1 = [];
    if (this.searchContent != "") {
      for (let i = 0; i < this.searchData.length; i++) {
        if ((this.searchData[i].csysPotGroupName).indexOf(this.searchContent) != -1) {
          temporayArray1.push(this.searchData[i]);
        }
      }
      this.data = temporayArray1;

      if (temporayArray1.length == 0) {
        this.totalRecords = 1;
      } else {
        this.totalRecords = temporayArray1.length;
      }
    } else {
      this._getWorkFlowListData(this.pageId);
    }
  }
  //重置
  restingSearch(): void {
    this._getWorkFlowListData(this.currentPage);
  }
  handleCancel(): void {
    this.isVisible = false;
    this.init();
  }

  //新增途程初始化
  insertWorkFlowInit(): void {
    this.title = "新增防呆组";

    this.init();
    this.isVisible = true;
  }


  //新增保存途程
  insertWorkFlow(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    console.log("test", this.form.controls)
    if (this.form.controls.flowGrpupName.invalid) return;
    //记录目标工序组的数量
    this.isOkLoading = true;
    let workflowdata = {
      "csysPotGroupName": this.form.controls.flowGrpupName.value,
      "csysPotGroupDesc": this.form.controls.workFlowDesc.value
    }
    let workGroupValue = this.form.controls.workFlowGroup.value
    console.log("this log1",workGroupValue)
    this.httpService.postHttp(this.workflowUrl, workflowdata).subscribe((data: any) => {
      //循环所选工序组 -----首先不为空在执行
      if (workGroupValue != null) {
        console.log("this log",workGroupValue)
        for (let i = 0; i < workGroupValue.length; i++) {
          const element = workGroupValue[i];
          let groupData = {
            "csysPotGroupFromId": data.data,
            "csysPotGroupToId": element
          }
          this.httpService.postHttp("/csyspotgropre", groupData).subscribe((data1: any) => {
            //计数
            //当执行完之后
            if (i == workGroupValue.length - 1) {
              this.isOkLoading = false;
              this.msg.create("success", "创建成功");
              this.isVisible = false;
              this._getWorkFlowListData(this.pageId);
              this.getFlowGroup()
              this.init();
            }
          })
        }
      } else {
        this.isOkLoading = false;
        this.msg.create("success", "创建成功");
        this.isVisible = false;
        this._getWorkFlowListData(this.pageId);
        this.getFlowGroup()
        this.init();
      }
    }, (err) => {
      this.msg.create("error", "发生错误，请稍后重试！");
      this.isOkLoading = false;
    })
  }
  cySysFlowpointPublicId;
  //编辑途程初始化
  editWorkflowInit(csysPotGroupId): void {
    //目标权限
    this.isSpinning = true;
    let preData = []
    this.cySysFlowpointPublicId = csysPotGroupId;
    this.title = "编辑工序组";
    this.isVisible = true;
    this.httpService.getHttp(this.workflowUrl + "/" + csysPotGroupId).subscribe((data: any) => {
      data = data.data;
      this.httpService.getHttp("/csyspotgropre").subscribe((data1: any) => {
        data1 = data1.data.list
        for (let i = 0; i < data1.length; i++) {
          if (data1[i].csysPotGroupFromId == csysPotGroupId) {
            preData.push(data1[i].csysPotGroupToId);
          }
        }
        this.form = this.fb.group({
          flowGrpupName: [data.csysPotGroupName, [Validators.required]],
          workFlowDesc: [data.csysPotGroupDesc, []],
          workFlowGroup: [preData, []],
        });
        this.isSpinning = false;
        console.log("from", this.form)
      })
    });
  }
  //编辑保存途程
  // -----> 编辑中的目标工序组多个，所以采用先删除再新增的方式
  editWorkflow(): void {
    let preData = [];
    let num = 0;
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.controls.flowGrpupName.invalid) return;
    let workGroupValue = this.form.controls.workFlowGroup.value
    this.isOkLoading = true;
    //新写入数据
    let params = {
      "csysPotGroupId": this.cySysFlowpointPublicId,
      "csysPotGroupName": this.form.controls.flowGrpupName.value,
      "csysPotGroupDesc": this.form.controls.workFlowDesc.value
    }
    //先删除原先权限表中的数据
    this.httpService.getHttp("/csyspotgropre").subscribe((data1: any) => {
      data1 = data1.data.list
      //现获取条件符合的权限数据，并获取数量
      for (let i = 0; i < data1.length; i++) {
        if (data1[i].csysPotGroupFromId == this.cySysFlowpointPublicId) {
          preData.push(data1[i].csysPotGroPreId)
        }
      }
      console.log("preData", preData);
      //当该工序组存在目标工序组时候
      if (preData.length != 0) {
        for (let index = 0; index < preData.length; index++) {
          const element = preData[index];
          this.httpService.deleteHttp("/csyspotgropre/" + element).subscribe((data2: any) => {
            //当删除最后一个工序的时候，新增新的数据
            if (index == preData.length - 1) {
              if (workGroupValue.length != 0) {
                for (let index1 = 0; index1 < workGroupValue.length; index1++) {
                  const element1 = workGroupValue[index1];
                  let preData = {
                    "csysPotGroupFromId": this.cySysFlowpointPublicId,
                    "csysPotGroupToId": element1,
                  }
                  console.log("帅气与美貌")
                  this.httpService.postHttp("/csyspotgropre", preData).subscribe((data3: any) => {
                    if (index1 == workGroupValue.length - 1) {
                      //编辑保存途程
                      this.httpService.putHttp(this.workflowUrl, params).subscribe((data4: any) => {
                        this.isOkLoading = false;
                        this.msg.create("success", "编辑成功");
                        this.isVisible = false;
                        this._getWorkFlowListData(this.pageId);
                        this.getFlowGroup()
                        this.init();
                      }, (err) => {
                        this.msg.create("error", "发生错误，请稍后重试！");
                        this.isOkLoading = false;
                      });
                    }
                  })
                }
              }
            }
          })
        }
        //当不存在布标工序组时候
      } else {
        //编辑保存途程
        if (workGroupValue.length != 0) {
          for (let index1 = 0; index1 < workGroupValue.length; index1++) {
            const element1 = workGroupValue[index1];
            let preData = {
              "csysPotGroupFromId": this.cySysFlowpointPublicId,
              "csysPotGroupToId": element1,
            }
            this.httpService.postHttp("/csyspotgropre", preData).subscribe((data3: any) => {
              if (index1 == workGroupValue.length - 1) {
                //编辑保存途程
                this.httpService.putHttp(this.workflowUrl, params).subscribe((data4: any) => {
                  this.isOkLoading = false;
                  this.msg.create("success", "编辑成功");
                  this.isVisible = false;
                  this._getWorkFlowListData(this.pageId);
                  this.getFlowGroup()
                  this.init();
                }, (err) => {
                  this.msg.create("error", "发生错误，请稍后重试！");
                  this.isOkLoading = false;
                });
              }
            })
          }
        }
      }

    })

  }

  //保存途程
  saveWorkFlow() {
    this.isOkLoading = true;
    if (this.title == "新增防呆组") this.insertWorkFlow()
    else this.editWorkflow();
  }

  //确认删除途程
  deleteWorkFlow(resolve) {
    this.loading = true;
    let preData = [];
    this.httpService.deleteHttp(this.workflowUrl + "/" + resolve).subscribe((data: any) => {
      this.httpService.getHttp("/csyspotgropre").subscribe((data1: any) => {
        data1 = data1.data.list
        for (let i = 0; i < data1.length; i++) {
          if (data1[i].csysPotGroupFromId == resolve) {
            preData.push(data1[i].csysPotGroPreId)
          }
        }
        if (preData.length != 0) {
          for (let index = 0; index < preData.length; index++) {
            const element = preData[index];
            this.httpService.deleteHttp("/csyspotgropre/" + element).subscribe((data2: any) => {
              if (index == preData.length - 1) {
                this.msg.create('success', `删除成功！`);
                this._getWorkFlowListData(this.pageId);
              }
            })
          }
        } else {
          this.msg.create('success', `删除成功！`);
          this._getWorkFlowListData(this.pageId);
        }
      })
    }, (err) => {
      this.msg.create("error", "发生错误，请稍后重试！");
    });
  }
  flowGroup
  getFlowGroup(): void {
    this.httpService.postHttp("/csyspotgroup/condition").subscribe((data: any) => {
      this.flowGroup = data.data;
      console.log("this.flowGroup", this.flowGroup)
    })
  }
  potData = [];
  //获取公共工序
  getPot():void{
    this.httpService.postHttp("/csyspotpublic/condition").subscribe((data: any) => {
      this.potData = data.data;
      console.log("potData",this.potData)
    })
  }
  potVisible = false;
  potName = "查看工序";
  showPotData = [];
  showPot(item):void{
    this.showPotData = [];
    this.potName = item.csysPotGroupName;
    for (let index = 0; index < this.potData.length; index++) {
      const element = this.potData[index];
      if(element.csysPotGroupId == item.csysPotGroupId){
        this.showPotData.push(element);
      }
      if(index == this.potData.length-1){
        this.potVisible = true;
      }
    }
    console.log("this.showPotData",this.showPotData)
  }
  potCancel():void{
    this.potVisible = false;
  }
}

