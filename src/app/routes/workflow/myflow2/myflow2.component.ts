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
  selector: 'myflow2',
  templateUrl: './myflow2.component.html',
  styleUrls: ['./myflow2.component.less']
})

export class Myflow2Component implements OnInit {

  constructor(private fb: FormBuilder, private http: _HttpClient, public msg: NzMessageService, private httpService: HttpService,
    private router: Router, private modalService: NzModalService, private cacheService: CacheService) { }

  form: FormGroup;
  avatar = 'assets/img/workflow.png';
  totalRecords = 0;
  currentPage = 1;

  project_desc = "";

  url = "/csysworkflow/listCondition?size=5";
  q: any = {
    status: 'progress',//默认选中进行中
  };
  loading = false;
  data: any[] = [];
  isVisible = false;
  isDeleteVisible = false;
  isOkLoading = false;
  typeradioValue = "0";
  selectedValue = "0";
  transferlist = [];
  workflowUrl = "/csysworkflow";
  parentList = [];
  title = "";
  nzOnOk = "";
  workFlowId = "";
  total = "";
  workflowType="0";
  searchContent = "";
  searchData;
  public ngOnInit(): void {
    this.init();
    this._getWorkFlowListData(this.currentPage);
  }

  init() {
    this.form = this.fb.group({
      workFlowName: [null, [Validators.required]],
      workFlowType: ['0', []],//默认标准途程
      parentId: [this.selectedValue, []],
      version: [null, []],
      dueDate: [null, []],
      comment: [null, []],
    });
  }

  //更换状态
  changeModel() {
    console.log(this.q.status)
  }

  //获取父途程
  getParentList() {
    this.httpService.getHttp(this.workflowUrl).subscribe((data: any) => {
      data = data.data.list;
      const children = [];
      data.forEach(element => {
        children.push({ "label": element.csysWorkflowName, "value": element.csysWorkflowId });
      });
      this.parentList = children;
    });
    //console.log("父途程数据", this.parentList);
  }

  //获取途程数据
  _getWorkFlowListData(currentPage: number) {
    this.loading = true;
    let params = {
      csysWorkflowType:this.workflowType
    };
    this.httpService.postHttp(this.url + "&page=" + currentPage, params).subscribe((data: any) => {
      //console.log(data)
      this.totalRecords = data.data.total;
      this.total = data.data.total;
      this.currentPage = currentPage;
      this.data = data.data.list;
      this.searchData = data.data.list;
      this.loading = false;
    });
  }
  clickPot(item):void{
    this._getWorkFlowListData(this.currentPage);
  }
  //搜索途程
  serchWorkFlow(): void {
    let temporayArray1 = [];
    if (this.searchContent != "") {
      for (let i = 0; i < this.searchData.length; i++) {
        if ((this.searchData[i].csysWorkflowName).indexOf(this.searchContent) != -1) {
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
      this._getWorkFlowListData(this.currentPage);
    }
  }
  //重置
  restingSearch(): void {
    this._getWorkFlowListData(this.currentPage);
  }
  getTransferData(): void {
    const ret = [];
    for (let i = 0; i < 20; i++) {
      ret.push({
        key: i.toString(),
        title: `用户${i + 1}`,
        description: `description of content${i + 1}`,
        direction: Math.random() * 2 > 1 ? 'right' : ''
      });
    }
    this.transferlist = ret;
  }

  transferreload(direction: string): void {
    this.getTransferData();
    this.msg.success(`your clicked ${direction}!`);
  }

  transferselect(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  transferchange(ret: {}): void {
    console.log('nzChange', ret);
  }
  
  handleCancel(): void {
    this.isVisible = false;
    this.isDeleteVisible = false;
    //this.msg.create('success', `取消成功！`);
  }

  //新增途程初始化
  insertWorkFlowInit(): void {
    this.title = "新增途程";
    this.init();
    this.getParentList();
    this.isVisible = true;
  }


  //新增保存途程
  insertWorkFlow(){
    let data = this.form.value;
    this.httpService.postHttp(this.workflowUrl+"/condition").subscribe((workData: any) => {
      workData = workData.data;
      for (let index = 0; index < workData.length; index++) {
        const element = workData[index];
        if(element.csysWorkflowName == data.workFlowName){
          this.msg.error("途程已经存在")
          return;
        }
      }
      this.isOkLoading = true;
      let params = {
        "csysWorkflowType": data.workFlowType,
        "csysWorkflowName": data.workFlowName,
        "csysWorkflowParentId": data.parentId,
        "csysWorkflowVersion": data.version,
        "csysWorkflowDueDate": data.dueDate,
        "csysWorkflowDesc": data.comment,
        "csysWorkflowIsneedRole":"0",
        "csysWorkflowIsneedPage":"1"
      }
      this.httpService.postHttp(this.workflowUrl, params).subscribe((data: any) => {
        this.isOkLoading = false;
        this.isVisible = false;
        this.msg.create('success', `保存成功！`);

        //默认为途程创建初始化节点
        

        //重新获取途程
        this._getWorkFlowListData(1);
      });
    })
    
  }

  //编辑途程初始化
  editWorkflowInit(item): void {
    this.title = "编辑途程";
    this.isVisible = true;
    this.workFlowId = item.csysWorkflowId;
    this.getParentList();
    this.httpService.getHttp(this.workflowUrl + "/" + item.csysWorkflowId).subscribe((data: any) => {
      data = data.data;
      this.form = this.fb.group({
        workFlowName: [data.csysWorkflowName, [Validators.required]],
        workFlowType: [data.csysWorkflowType, []],
        parentId: [data.csysWorkflowParentId, []],
        version: [data.csysWorkflowVersion, []],
        dueDate: [data.csysWorkflowDueDate, []],
        comment: [data.csysWorkflowDesc, []],
      });
    });
  }

  //编辑保存途程
  editWorkflow(): void { 
    let editData = this.form.value;
    this.httpService.postHttp(this.workflowUrl+"/condition").subscribe((workData: any) => {
      workData = workData.data;
      for (let index = 0; index < workData.length; index++) {
        const element = workData[index];
        if(element.csysWorkflowName == editData.workFlowName){
          this.msg.error("途程已经存在")
          return;
        }
      }
      this.isOkLoading = true;
    //新写入数据
    let params = {
      "csysWorkflowId": this.workFlowId,
      "csysWorkflowType": editData.workFlowType,
      "csysWorkflowName": editData.workFlowName,
      "csysWorkflowParentId": editData.parentId,
      "csysWorkflowVersion": editData.version,
      "csysWorkflowDueDate": editData.dueDate,
      "csysWorkflowDesc": editData.comment
    }
    //保存途程
    this.httpService.putHttp(this.workflowUrl, params).subscribe((data: any) => {
      this.isOkLoading = false;
      this.isVisible = false;
      this.msg.create('success', `保存成功！`);
      //重新获取途程
      this._getWorkFlowListData(1);
    });
  })
  }

  //保存途程
  saveWorkFlow() {
    if (this.title == "新增途程") this.insertWorkFlow()
    else this.editWorkflow();
  }
  deleteId
  //删除途程确认信息
  deleteworkflowInit(item): void {
    this.deleteId = item.csysWorkflowId;
    console.log("deleteId",item)
    this.modalService.confirm({
      nzTitle: '确认删除吗？',
      //nzContent: 'Bla bla ...',
      nzOkText: '确认',
      nzCancelText: '取消',
      //确认删除
      nzOnOk: () => new Promise((resolve, reject) => {
        this.deleteWorkFlow(resolve); 
      }).catch(() => console.log('Oops errors!'))
    });
  }

  //删除取消
  deleteCancel() {
    this.isDeleteVisible = false;
  }

  //确认删除途程
  deleteWorkFlow(resolve) {
    console.log("item.workflow_id",resolve)
    //新写入数据
    let params = {  
      "csysWorkflowId": this.deleteId,
      "csysWorkflowIsDelete": "1",
    }  
    //保存途程
    this.httpService.putHttp(this.workflowUrl, params).subscribe((data: any) => {
      let delData = {
        "csysWorkflowId":this.deleteId,
      }
      this.httpService.postHttp("csyspot/condition",delData).subscribe((potdata: any) => {
        potdata = potdata.data;
        for (let index = 0; index < potdata.length; index++) {
          const element = potdata[index];
          let delpot = {
            "csysPotId": element.csysPotId,
            "csysPotIsDelete": "1"
          }
          this.httpService.putHttp("csyspot", delpot).subscribe((data: any) => {})
        }
      })
      //关闭弹窗
      resolve();
      this.msg.create('success', `删除成功！`);
      this.isDeleteVisible = false;
      //重新获取途程 
      this._getWorkFlowListData(1);
    });
  }

  navigatedetail(item): void {

    console.log("内存信息", this.cacheService.getNone("domain"))
    //this.router.navigate(['/workflow/flowchart/' + item.csysWorkflowId + '']);
    let queryParams = {};
    queryParams['workflowId'] = item.csysWorkflowId;

    this.router.navigate(['/workflow/flowchart/'], {
      queryParams
    });
  }
}

