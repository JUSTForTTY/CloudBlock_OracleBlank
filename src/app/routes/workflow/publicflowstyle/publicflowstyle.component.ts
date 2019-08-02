import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as shape from 'd3-shape';
import * as graph from '@swimlane/ngx-graph';
import { HttpService } from 'ngx-block-core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { CacheService } from '@delon/cache';


@Component({
  selector: 'app-publicflowstyle',
  templateUrl: './publicflowstyle.component.html',
  styleUrls: ['./publicflowstyle.component.less']
})

export class PublicflowstyleComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: _HttpClient, public msg: NzMessageService, private httpService: HttpService,
    private router: Router, private modalService: NzModalService, private cacheService: CacheService) { }
  form: FormGroup;
  avatar = 'assets/img/workflow.png';
  totalRecords = 0;
  currentPage = 1;
  project_desc = "";
  color = "rgb(0,200,255)"
  url = "/csyspotpublic/listCondition?size=5";
  q: any = {
    status: 'progress',//默认选中进行中
  };
  loading = false;
  data: any[] = [];
  isVisible = false;
  isOkLoading = false;
  workflowUrl = "/csyspotpublic";
  title = "";
  total = "";
  searchContent = "";
  searchData;
  public ngOnInit(): void {
    this.init();
    this._getWorkFlowListData(this.currentPage);
  }

  init() {
    this.form = this.fb.group({
      workFlowStyleName: [null, [Validators.required]],
      workFlowStyle: ["rect", [Validators.required]],
    });
  }

  pageId = 1;
  //获取途程数据
  _getWorkFlowListData(currentPage: number) {
    this.pageId = currentPage;
    this.loading = true;
    this.httpService.postHttp("/csyspotstyle/listCondition?size=5" + "&page=" + currentPage).subscribe((data: any) => {
      //console.log(data)
      this.totalRecords = data.data.total;
      this.total = data.data.total;
      this.currentPage = currentPage;
      this.data = data.data.list;
      this.searchData = data.data.list;
      this.loading = false;
    });
  }

  //搜索途程
  serchWorkFlow(): void {
    let temporayArray1 = [];
    if (this.searchContent != "") {
      for (let i = 0; i < this.searchData.length; i++) {
        if ((this.searchData[i].csysPotStyleName).indexOf(this.searchContent) != -1) {
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
    this.title = "新增公共工序";
    this.init();
    this.isVisible = true;

  }
  @HostListener('window:close', ['$event'])
  closea(event) {
    console.log(event)
    window.close();
  }
  //新增保存途程
  insertWorkFlow(): void {
    // for (const i in this.form.controls) {
    //   this.form.controls[i].markAsDirty();
    //   this.form.controls[i].updateValueAndValidity();
    // }
    // if (this.form.controls.csysPotStyleName.invalid) return;
    this.isOkLoading = true;
    let workflowdata = {
      "csysPotStyleName": this.form.controls.workFlowStyleName.value,
      "csysPotStyleColor": this.color,
      "csysPotStyleDesc": this.form.controls.workFlowStyle.value
    }
    this.httpService.postHttp("/csyspotstyle/condition", { "csysPotStyleName": this.form.controls.workFlowStyleName.value }).subscribe((pdata: any) => {
      if (pdata.data.length != 0) {
        this.msg.error("该功能已存在!");
        this.isOkLoading = false;
        return;
      } else {
        console.log("workflowdata", workflowdata)
        this.httpService.postHttp("/csyspotstyle", workflowdata).subscribe((data: any) => {
          this.isOkLoading = false;
          this.msg.create("success", "创建成功");
          this.isVisible = false;
          this._getWorkFlowListData(this.pageId);
          this.init();

        }, (err) => {
          this.msg.create("error", "发生错误，请稍后重试！");
        })
      }
    })

  }
  cySysFlowpointPublicId;
  styleName;
  //编辑初始化
  editWorkflowInit(csysPotStyleId): void {
    if (csysPotStyleId == "LHCsysPotStyle20190620042709661000002") {
      this.msg.error("系统功能禁止编辑！");
      return;
    }
    this.cySysFlowpointPublicId = csysPotStyleId;
    this.title = "编辑途程";
    this.isVisible = true;
    this.httpService.getHttp("/csyspotstyle" + "/" + csysPotStyleId).subscribe((data: any) => {
      data = data.data;
      console.log(data)
      this.color = data.csysPotStyleColor;
      this.styleName = data.csysPotStyleName
      this.form = this.fb.group({
        workFlowStyleName: [data.csysPotStyleName, [Validators.required]],
        workFlowStyle: [data.csysPotStyleDesc, []],
      });
    });
  }

  //编辑保存途程
  editWorkflow(): void {
    this.isOkLoading = true;
    //新写入数据
    let workflowdata = {
      "csysPotStyleId": this.cySysFlowpointPublicId,
      "csysPotStyleName": this.form.controls.workFlowStyleName.value,
      "csysPotStyleColor": this.color,
      "csysPotStyleDesc": this.form.controls.workFlowStyle.value
    }
    console.log("123", workflowdata);
    //编辑保存途程
    this.httpService.postHttp("/csyspotstyle/condition", { "csysPotStyleName": this.form.controls.workFlowStyleName.value }).subscribe((pdata: any) => {
      console.log("123345",pdata)
      if (pdata.data.length >= 1 && this.styleName != workflowdata.csysPotStyleName) {
          this.msg.error("该功能已存在!")
          this.isOkLoading = false;
          return;       
      }
      this.httpService.putHttp("/csyspotstyle", workflowdata).subscribe((data: any) => {
        this.isOkLoading = false;
        this.msg.create("success", "编辑成功");
        this.isVisible = false;
        this._getWorkFlowListData(this.pageId);
        this.init();
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

  //确认删除途程功能
  deleteWorkFlow(csysPotStyleId) {
    if (csysPotStyleId == "LHCsysPotStyle20190620042709661000002") {
      this.msg.error("系统功能禁止删除！");
      return;
    }
    this.httpService.postHttp("csyspotpublic/condition", { "csysPotStyleId": csysPotStyleId }).subscribe((potdata: any) => {
      potdata = potdata.data;
      if (potdata.length != 0) {
        this.msg.error("该公共样式被公共工序占用,请先改绑或者删除");
        return;
      } else {
        let deleteData = {
          "csysPotStyleId": csysPotStyleId,
          "csysPotStyleIsDelete": "1"
        }
        this.httpService.putHttp("/csyspotstyle", deleteData).subscribe((data: any) => {
          this.msg.create('success', `删除成功！`);
          this._getWorkFlowListData(this.pageId);
        }, (err) => {
          this.msg.create("error", "发生错误，请稍后重试！");
        });
      }
    })

  }
  //选择器颜色变化
  colorChange(event): void {
    this.color = event;
    console.log(event)
  }
}


