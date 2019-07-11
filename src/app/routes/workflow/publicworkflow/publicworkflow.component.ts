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
  selector: 'publicworkflow',
  templateUrl: './publicworkflow.component.html',
  styleUrls: ['./publicworkflow.component.less']
})
export class PublicworkflowComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: _HttpClient, public msg: NzMessageService, private httpService: HttpService,
    private router: Router, private modalService: NzModalService, private cacheService: CacheService) { }

  form: FormGroup;
  avatar = 'assets/img/workflow.png';
  totalRecords = 0;
  currentPage = 1;
  project_desc = "";
  url = "/csyspotpublic/listCondition?size=5";
  q: any = {
    status: 'progress',//默认选中进行中
  };
  loading = false;
  data: any[] = [];
  isVisible = false;
  isOkLoading = false;
  workflowUrl = "csyspotpublic";
  potpubrsUrl = "potpubrs";
  potPageUrl = "csyspotpubpage";
  resourceUrl = "tresource";
  title = "";
  total = "";
  searchContent = "";
  searchData;
  resourceData = [];
  pageList;
  public ngOnInit(): void {
    this._getWorkFlowListData(this.currentPage);
    this.init();
    this.getPageData();
    this.getPageGroup();
    // this.getResource();
  }

  init() {
    this.form = this.fb.group({
      workFlowName: [null, [Validators.required]],
      workFlowStyle: [null, [Validators.required]],
      workFlowGroup: [null, [Validators.required]],
      workFlowPage: [null],
      workFlowResource: [null],
      workFlowDesc: [null],
    });
  }

  pageId = 1;
  //获取途程数据
  _getWorkFlowListData(currentPage: number) {
    this.searchShow = false;
    this.pageId = currentPage;
    this.loading = true;
    let searchData = {
      "csysPotPublicName": this.searchContent
    }
    this.httpService.postHttp("/csyspotpublic/listSearchCondition?size=5&page=" + currentPage).subscribe((data: any) => {
      ////console.log(data)
      this.totalRecords = data.data.total;
      this.total = data.data.total;
      this.currentPage = currentPage;
      this.data = data.data.list;
      this.searchData = data.data.list;//用于搜索列表
      this.loading = false;
      this.getFlowStyle();
      //console.log("pagedata", this.data);
    });
  }
  searchShow = false;
  //搜索途程
  serchWorkFlow(currentPage): void {
    if (this.searchContent) {
      this.searchShow = true;
      this.httpService.postHttp("/csyspotpublic/listSearchCondition?size=5&page=" + currentPage, { "csysPotPublicName": this.searchContent }).subscribe((data: any) => {
        ////console.log(data)
        this.totalRecords = data.data.total;
        this.total = data.data.total;
        this.currentPage = currentPage;
        this.data = data.data.list;
        this.searchData = data.data.list;//用于搜索列表
        this.loading = false;
        this.getFlowStyle();
        console.log("pagedata", this.data);
      });
    } else {
      this._getWorkFlowListData(1);
    }
  }
  //重置
  restingSearch(): void {
    this._getWorkFlowListData(1);
  }
  handleCancel(): void {
    this.isVisible = false;
    this.init();

  }

  //新增途程初始化
  insertWorkFlowInit(): void {
    this.title = "新增公共工序";
    this.init();
    this.getResource();
    this.getPageData();
    this.getFlowStyle();
    this.isVisible = true;
  }


  //新增保存途程
  insertWorkFlow(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.controls.workFlowName.invalid) return;
    this.isOkLoading = true;
    let workflowdata = {
      "csysPotPublicName": this.form.controls.workFlowName.value,
      "csysPotPublicDesc": this.form.controls.workFlowDesc.value,
      "csysPotStyleId": this.form.controls.workFlowStyle.value,
      "csysPotGroupId": this.form.controls.workFlowGroup.value
    }
    this.httpService.postHttp(this.workflowUrl + "/condition", { "csysPotPublicName": this.form.controls.workFlowName.value }).subscribe((wdata: any) => {
      if (wdata.data.length > 0) {
        this.msg.error("该工序已存在!");
        this.isOkLoading = false;
        return;
      }
      this.httpService.postHttp(this.workflowUrl, workflowdata).subscribe((data: any) => {
        this.isOkLoading = false;
        //新增公共节点再新增资源
        this.insetPotPubRs(data.data,this.form.controls.workFlowName.value);
        //新增功能页面
        this.insetPotPage(data.data);
        this.msg.create("success", "创建成功");
        this.isVisible = false;
        this._getWorkFlowListData(this.pageId);

      }, (err) => {
        this.msg.create("error", "发生错误，请稍后重试！");
      })
    })
  }
  cySysFlowpointPublicId;
  spinning = false;
  PublicName;
  //编辑途程初始化
  editWorkflowInit(cySysFlowpointPublicId): void {
    if (cySysFlowpointPublicId == "LHCsysPotPublic20190620043043486000010") {
      this.msg.error("系统工序禁止编辑！");
      return;
    }
    this.spinning = true;
    this.init();
    this.getResource();
    let potrs = [];
    let potPage = null;
    this.cySysFlowpointPublicId = cySysFlowpointPublicId;
    this.title = "编辑途程";
    this.isVisible = true;
    //获取点击的这条数据
    this.httpService.getHttp(this.workflowUrl + "/" + cySysFlowpointPublicId).subscribe((data: any) => {
      //获取这个工序下的资源
      this.httpService.postHttp(this.resourceUrl + "/condition", { "csysPotPublicId": cySysFlowpointPublicId }).subscribe((potRsData: any) => {
        //获取这个工序下的功能页面
        this.httpService.postHttp(this.potPageUrl + "/condition", { "csysPotPublicId": cySysFlowpointPublicId }).subscribe((pageData: any) => {
          //获取资源
          potRsData = potRsData.data;
          for (const key in potRsData) {
            potrs.push(potRsData[key].tResourceId);
            this.resourceData.push(potRsData[key])
            // console.log(potRsData[key])
            }
          console.log(potrs)
          // pageData = pageData.data;
          // for (let index = 0; index < potRsData.length; index++) {
          //   const element = potRsData[index];
          //   if (element.csysPotPublicId == cySysFlowpointPublicId) {
          //     potrs.push(element.tResourceId);
          //     this.resourceData.push(element);
          //   }
          // }
          //获取功能页面
          if (pageData.data.length > 0) {
            if (pageData.data[0].csysPotPubPageDesc != "") {
              potPage = pageData.data[0].csysPotPubPageDesc;
            }
            console.log("pageDatal", potPage);
          }
          data = data.data;
          this.PublicName = data.csysPotPublicName;
          this.form = this.fb.group({
            workFlowName: [data.csysPotPublicName, [Validators.required]],
            workFlowDesc: [data.csysPotPublicDesc, []],
            workFlowStyle: [data.csysPotStyleId, [Validators.required]],
            workFlowGroup: [data.csysPotGroupId, [Validators.required]],
            workFlowResource: [potrs],
            workFlowPage: [potPage]
          });
          this.form.updateValueAndValidity()
          this.spinning = false;
        });
      });
    });
  }

  //编辑保存途程
  editWorkflow(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.controls.workFlowName.invalid) return;
    this.isOkLoading = true;
    //新写入数据
    let params = {
      "csysPotPublicId": this.cySysFlowpointPublicId,
      "csysPotPublicName": this.form.controls.workFlowName.value,
      "csysPotPublicDesc": this.form.controls.workFlowDesc.value,
      "csysPotStyleId": this.form.controls.workFlowStyle.value,
      "csysPotGroupId": this.form.controls.workFlowGroup.value
    }
    //console.log("123", params);
    //编辑保存途程
    this.httpService.postHttp(this.workflowUrl + "/condition", { "csysPotPublicName": this.form.controls.workFlowName.value }).subscribe((wdata: any) => {
      if (wdata.data.length > 0 && params.csysPotPublicName != this.PublicName) {
        this.msg.error("该工序已存在!");
        this.isOkLoading = false;
        return;
      }
      this.httpService.putHttp(this.workflowUrl, params).subscribe((data: any) => {
        this.editPotPage(this.cySysFlowpointPublicId);
        this.editPotPubRs(this.cySysFlowpointPublicId,this.form.controls.workFlowName.value);
        this.isOkLoading = false;
        this.msg.create("success", "编辑成功");
        this.isVisible = false;
        this._getWorkFlowListData(this.pageId);
      }, (err) => {
        this.msg.create("error", "发生错误，请稍后重试！");
      });
    });
  }

  //保存途程
  saveWorkFlow() {
    if (this.title == "新增公共工序") this.insertWorkFlow()
    else this.editWorkflow();
  }

  //确认删除途程
  deleteWorkFlow(resolve) {
    if (resolve == "LHCsysPotPublic20190620043043486000010") {
      this.msg.error("系统工序禁止删除！");
      return;
    }
    let postBody = { "csysPotPublicId": resolve };
    this.httpService.postHttp("csyspot/condition", postBody).subscribe((potdata: any) => {
      if (potdata.data.length != 0) {
        this.msg.error("改工序在途程中被使用，请先解除改工序");
        return;
      } else {
        let deleteData = {
          "csysPotPublicId": resolve,
          "csysPotPublicIsDelete": "1"
        }
        this.httpService.putHttp(this.workflowUrl, deleteData).subscribe((data: any) => {
          this.deletePotPage(resolve);
          this.deletePotRs(resolve);
          this.msg.create('success', `删除成功！`);
          this._getWorkFlowListData(this.pageId);
        }, (err) => {
          this.msg.create("error", "发生错误，请稍后重试！");
        });
      }
    });

  }
  flowStyle;
  flowGroup;
  //获取样式
  getFlowStyle(): void {
    this.httpService.postHttp("/csyspotstyle/condition").subscribe((data: any) => {
      this.flowStyle = data.data;
      this.httpService.postHttp("/csyspotgroup/condition").subscribe((data: any) => {
        this.flowGroup = data.data;
        for (let index = 0; index < this.data.length; index++) {
          const element = this.data[index];
          this.data[index]["style"] = {
            "csysPotStyleName": "",
            "csysPotStyleColor": "",
            "csysPotStyleDesc": ""
          };
          this.data[index]["group"] = { "csysPotGroupName": "" };
          //获取当前公共工序的样式
          for (let index1 = 0; index1 < this.flowStyle.length; index1++) {
            const element1 = this.flowStyle[index1];
            if (element.csysPotStyleId == element1.csysPotStyleId) {
              this.data[index]["style"] = element1;

              break;
            }
          }
          //获取当前公共工序的工序组
          for (let index1 = 0; index1 < this.flowGroup.length; index1++) {
            const element1 = this.flowGroup[index1];
            if (element.csysPotGroupId == element1.csysPotGroupId) {
              this.data[index]["group"] = element1;
              break;
            }
          }
        }
        console.log("this.data", this.data)
      })
    })
  }



  getResource(): void {
    this.resourceData = []
    //获取资源名称
    this.httpService.postHttp(this.resourceUrl + "/condition").subscribe((data: any) => {
      data = data.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (!element.csysPotPublicId) {
          this.resourceData.push(element)
        }
      }

    })
  }

  getPageData(): void {
    //获取页面
    // this.httpService.postHttp("/csyssimplepage/condition").subscribe((data: any) => {
    //   this.pageList = data.data;
    // });
    this.pageList = [
      {
        "csysPageId": "SUCUCsysPage20190222000045",
        "csysPageName": "良品不良品采集"
      },
      {
        "csysPageId": "SUCUCsysPage20190517000245",
        "csysPageName": "集成备料"
      },
      {
        "csysPageId": "SUCUCsysPage20190516000241",
        "csysPageName": "KeyPart备料"
      },
      {
        "csysPageId": "SUCUCsysPage20190530000274",
        "csysPageName": "Keyparts上料"
      },
      {
        "csysPageId": "SUCUCsysPage20190528000263",
        "csysPageName": "集成上料"
      },
      {
        "csysPageId": "SUCUCsysPage20190410000177",
        "csysPageName": "归属工单采集（内页）"
      },
      {
        "csysPageId": "SUCUCsysPage20190403000171",
        "csysPageName": "批量归属工单"
      }

    ]
  }
  /*由原来的资源和公共工序多对多，变成一个资源对应一个工序，一个工序可以对应多个资源
    注释掉之前多对多，需要的话可以开放
  */

  insetPotPubRs(pfId,wname): void {
    //当新增公共节点资源
    let potRsId = this.form.value.workFlowResource;
    if (potRsId) {
      for (let index = 0; index < potRsId.length; index++) {
        const element = potRsId[index];
        let potRsData = {
          "csysPotPublicId": pfId,
          "tResourceId": element,
          "flag1":wname

        }
        //console.log("rs检测", potRsData)
        this.httpService.putHttp(this.resourceUrl, potRsData).subscribe((data: any) => {
          if (index == potRsId.length - 1) {
            this.getResource();
          }
        })
        //this.httpService.postHttp(this.potpubrsUrl, potRsData).subscribe((data: any) => { })
      }
    }
  }
  insetPotPage(pfId): void {
    let pageData = this.form.value.workFlowPage;

    if (pageData) {
      this.httpService.postHttp("csyspagegroup/condition", { "csysPageGroupCode": pageData }).subscribe((pdata: any) => {
        let potPage = pdata.data;
        console.log("potPageData新增", potPage)
        for (let index = 0; index < potPage.length; index++) {
          const element = potPage[index];
          let potPageData = {
            "csysPotPublicId": pfId,
            "csysPageId": element.csysPageId,
            "csysPotPubPageDesc": pageData
          }
          console.log("potPageData", potPageData)
          this.httpService.postHttp(this.potPageUrl, potPageData).subscribe((data: any) => { });
        }

        //console.log("potPageData新增", potPage[0])


      });
    }
  }
  //编辑工序资源
  editPotPubRs(pfId,wname): void {
    let deleteData = [];
    this.httpService.postHttp(this.resourceUrl + "/condition").subscribe((data: any) => {
      data = data.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotPublicId == pfId) {
          deleteData.push(element.tResourceId)
        }
      }
      //console.log("deleteData", deleteData);

      if (deleteData.length > 0) {
        for (let index = 0; index < deleteData.length; index++) {
          const element = deleteData[index];
          let potRsData = {
            "csysPotPublicId": "",
            "tResourceId": element,
            "flag1":""
          }
          //console.log("potRsData", potRsData)
          this.httpService.putHttp(this.resourceUrl, potRsData).subscribe((data: any) => {
          })
          // this.httpService.deleteHttp(this.potpubrsUrl + "/" + element).subscribe((data: any) => { })
          if (index == deleteData.length - 1) {
            this.insetPotPubRs(pfId,wname);
          }
        }
      } else if (this.form.value.workFlowResource) {
        this.insetPotPubRs(pfId,wname);
      }
    })
  }
  editPotPage(pfId): void {
    let deleteData = [];
    //console.log("帅气123");
    this.httpService.postHttp(this.potPageUrl + "/condition").subscribe((data: any) => {
      data = data.data;
      //console.log("帅气123456");
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotPublicId == pfId) {
          deleteData.push(element.csysPotPubPageId)
        }
      }
      //console.log("帅气123456", deleteData.length + "", this.form.value);
      if (deleteData.length > 0) {
        for (let index = 0; index < deleteData.length; index++) {
          const element = deleteData[index];
          let deleteBody = {
            "csysPotPubPageId": element,
            "csysPotPubPageIsDelete": "1"
          }
          this.httpService.putHttp(this.potPageUrl, deleteBody).subscribe((data: any) => {
            if (index == deleteData.length - 1) {
              this.insetPotPage(pfId);
            }
          })

        }
      } else if (this.form.value.workFlowPage) {
        //console.log("帅气");

        this.insetPotPage(pfId);
      }
    })
  }
  deletePotPage(pfId): void {
    let deleteData = [];
    //删除之前先校验这个工序是否被途程使用

    this.httpService.postHttp(this.potPageUrl + "/condition").subscribe((data: any) => {
      data = data.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotPublicId == pfId) {
          deleteData.push(element.csysPotPubPageId)
          //console.log("deleteData", deleteData);
        }
      }
      if (deleteData.length > 0) {
        for (let index = 0; index < deleteData.length; index++) {
          const element = deleteData[index];
          let deleteBody = {
            "csysPotPubPageId": element,
            "csysPotPubPageIsDelete": "1"
          }
          this.httpService.putHttp(this.potPageUrl, deleteBody).subscribe((data: any) => { })
        }
      }
    })


  }
  deletePotRs(pfId): void {
    let deleteData = [];
    this.httpService.postHttp(this.resourceUrl + "/condition").subscribe((data: any) => {
      data = data.data;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.csysPotPublicId == pfId) {
          deleteData.push(element.tResourceId)
        }
      }
      if (deleteData.length > 0) {
        for (let index = 0; index < deleteData.length; index++) {
          const element = deleteData[index];
          let potRsData = {
            "csysPotPublicId": "",
            "tResourceId": element
          }
          this.httpService.putHttp(this.resourceUrl, potRsData).subscribe((data: any) => { })
          //this.httpService.deleteHttp(this.potpubrsUrl + "/" + element).subscribe((data: any) => { })
        }
      }
    })
  }
  groupData = [];
  getPageGroup(): void {
    this.httpService.postHttp("csyspagegroup/condition").subscribe((data: any) => {
      data = data.data;
      this.groupData.push({
        csysPageGroupCode: data[0].csysPageGroupCode,
        csysPageGroupDesc: data[0].csysPageGroupDesc
      })
      for (let index = 1; index < data.length; index++) {
        const element = data[index];
        for (let index1 = 0; index1 < this.groupData.length; index1++) {
          const element1 = this.groupData[index1];
          if (element.csysPageGroupCode == element1.csysPageGroupCode) {
            break;
          } else if (index1 == this.groupData.length - 1) {
            console.log("lenth", this.groupData)
            this.groupData.push({
              csysPageGroupCode: element.csysPageGroupCode,
              csysPageGroupDesc: element.csysPageGroupDesc
            })
          }
        }
      }
      console.log("test1a", this.groupData);
    })
  }
}

