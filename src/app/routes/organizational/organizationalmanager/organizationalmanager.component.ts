import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'ngx-block-core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
// import { ConsoleReporter } from 'jasmine';


@Component({
  selector: 'organizationalmanager',
  templateUrl: './organizationalmanager.component.html',
  styleUrls: ['./organizationalmanager.component.less']
})




export class OrganizationalmanagerComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private http: _HttpClient,
    public msg: NzMessageService,
    private httpService: HttpService,
    private router: Router,
    private modalService: NzModalService,) { }

  logo = "assets/img/icon-zu.png";

  form: FormGroup;
  q: any = {
    status: 'all',
  };
  loading = false;
  data: any[] = [];
  isVisible = false;
  isOkLoading = false;
  transferlist = [];
  allChecked = false;
  indeterminate = true;
  treeMainId;
  totalRecords = 0;
  currentPage = 1;
  total = 0;
  organizeUrl = "/csysorgstruce";
  url = "/csysorgstruce/listCondition?size=5";
  pageUrl = "/cysyspage";
  pageConditionUrl = "/csyspage/listCondition";
  permissionUrl = "/csysorgauth";
  title = "";
  organizeId = "";
  isDeleteVisible = false;
  //搜索
  searchContent;
  pageList = [];
  pageId = 1;

  public ngOnInit(): void {
    this.formInit();
    //获取组织架构数据
    this.getOrganize(this.currentPage);
  }

  formInit() {
    this.form = this.fb.group({
      organizeName: [null, [Validators.required]],
      oragnizeType: ["0", [Validators.required]],
      isEnabled: [true, [Validators.required]],
      pagesallcheck: [null, []],
      enablePages: [this.pageList, []]
    });
  }

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
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

  //获取组织架构数据
  getOrganize(currentPage: number) {
    console.log("获取组织架构数据")
    this.loading = true;
    this.httpService.postHttp(this.url + "&page=" + currentPage).subscribe((data: any) => {
      //console.log(data)
      this.totalRecords = data.data.total;
      this.total = data.data.total;
      this.currentPage = currentPage;
      this.data = data.data.list;
      this.loading = false;
    });
  }

  //初始化新增组织架构
  addOrganize(): void {
    this.formInit();
    this.title = "新增组织架构";
    //获取页面数据
    this.isVisible = true;
    this.getPageData(0);
  }

  //查询数据
  getPageData(flag) {
    this.httpService.postHttp(this.pageConditionUrl, {}).subscribe((data: any) => {
      data = data.data.list;
      console.log("页面数据", data);
      let pageData = [];
      data.forEach(element => {
        pageData.push({ label: element.csysPageName, value: element.csysPageId, checked: false, id: "" });
      });
      //更新操作需查询已设置的权限页面
      if (flag == 1) {
        //根据组织架构编号编号查询权限页面
        let params = {
          "csysOrgStruceId": this.organizeId,
        }
        this.httpService.postHttp(this.permissionUrl + "/listCondition", params).subscribe((data: any) => {
          data = data.data.list;
          data.forEach(element => {
            //勾选已设置的数据
            try {
              pageData.forEach(page => {
                if (element.csysPageId == page.value) {
                  //权限页面编号
                  page.id = element.csysOrgAuthId;
                  //勾选已选择
                  page.checked = true;
                  throw Error;
                }
              });
            } catch (e) {
            }
          });
          //console.log("当前页面数据", pageData);
          this.pageList = pageData;
          this.isVisible = true;
        });
      } else {
        this.pageList = pageData;
        this.isVisible = true;
      }
    });
  }

  //初始化编辑组织架构
  editOrganizeInit(item) {
    this.title = "编辑组织架构";
    this.httpService.getHttp(this.organizeUrl + "/" + item.csysOrgStruceId).subscribe((data: any) => {
      data = data.data;
      this.form = this.fb.group({
        organizeName: [data.csysOrgStruceName, [Validators.required]],
        oragnizeType: [data.csysOrgStruceType, [Validators.required]],
        isEnabled: [data.csysOrgStruceIsEnabled == "1" ? true : false, [Validators.required]],
        pagesallcheck: [null, []],
        enablePages: [this.pageList, []]
      });
      this.organizeId = item.csysOrgStruceId;
      //查询页面数据
      this.getPageData(1);
      this.isVisible = true
    });
  }

  //保存组织架构
  saveOrganize() {
    console.log("保存组织架构");
    if (this.title == "新增组织架构") this.insertOrganize()
    else this.editOrganize();
  }

  //新增组织架构
  insertOrganize() {
    this.isOkLoading = true;
    let params = {
      "csysOrgStruceName": this.form.value.organizeName,
      "csysOrgStruceType": this.form.value.oragnizeType,
      "csysOrgStruceIsEnabled": this.form.value.isEnabled == true ? 1 : 0
    }
    this.httpService.postHttp(this.organizeUrl, params).subscribe((data: any) => {
      this.isOkLoading = false;
      this.isVisible = false;
      //获取页面数据
      let pageData = JSON.parse(JSON.stringify(this.pageList));
      if (pageData.length > 0) {
        for (let i = 0; i < pageData.length; i++) {
          if (pageData[i].checked == true) {
            let params = {
              "csysOrgStruceId": data.data,
              "csysPageId": pageData[i].value,
              "csysPageName": pageData[i].label
            };
            this.httpService.postHttp(this.permissionUrl, params).subscribe((data: any) => {
              if (i == pageData.length - 1) this.msg.create('success', `保存成功！`);
            });
          } else if (i == pageData.length - 1) this.msg.create('success', `保存成功！`);
        }
      } else {
        this.msg.create('success', `保存成功！`);
      }
      //重新获取工作流
      this.getOrganize(1);
    });
  }

  //编辑组织架构
  editOrganize() {
    this.isOkLoading = true;
    let data = this.form.value;
    let params = {
      "csysOrgStruceId": this.organizeId,
      "csysOrgStruceName": data.organizeName,
      "csysOrgStruceType": data.oragnizeType,
      "csysOrgStruceIsEnabled ": data.isEnabled == true ? 1 : 0
    }
    this.httpService.putHttp(this.organizeUrl, params).subscribe((data: any) => {
      let pageData = this.pageList;
      
      let length = pageData.length;
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          let pageDetail = pageData[i];
          //新增
          if (pageDetail.id == "" && pageDetail.checked == true) {
            let params = {
              "csysOrgStruceId": this.organizeId,
              "csysPageId": pageDetail.value,
              "csysPageName": pageDetail.label
            }
            console.log("ceshiceshi",params);
            this.httpService.postHttp(this.permissionUrl, params).subscribe((data: any) => {
              this.updateComplete(i, length);
            });
            //修改
          } else if (pageDetail.id != "" && pageDetail.checked == true) {
            let params = {
              "csysOrgStruceId": pageDetail.id,
              "csysPageId": pageDetail.value,
              "csysPageName": pageDetail.label,
            }
            this.httpService.putHttp(this.permissionUrl, params).subscribe((data: any) => {
              this.updateComplete(i, length);
            });
            //删除
          } else if (pageDetail.id != "" && pageDetail.checked == false) {
            let params = {
              "csysOrgAuthId": pageDetail.id,
              "csysOrgAuthIsDelete": "1"
            }
            this.httpService.putHttp(this.permissionUrl, params).subscribe((data: any) => {
              this.updateComplete(i, length);
            });
          } else if (i == length - 1) this.updateComplete(i, length);
        }
      } else {
        this.isVisible = false;
        this.isOkLoading = false;
        this.msg.create('success', `保存成功！`);
        //重新获取工作流
        this.getOrganize(1);
      }
    });
  }

  updateComplete(i, j) {
    if (i == j - 1) {
      this.msg.create('success', `保存成功！`);
      this.isVisible = false;
      this.isOkLoading = false;
      //重新获取工作流
      this.getOrganize(1);
    }
  }


  deleteOrganizeInit(item) {
    this.organizeId = item.csysOrgStruceId;
    this.modalService.confirm({
      nzTitle: '确认删除吗？',
      //nzContent: 'Bla bla ...',
      nzOkText: '确认',
      nzCancelText: '取消',
      //确认删除
      nzOnOk: () => new Promise((resolve, reject) => {
        this.deleteOrganize(resolve);
        console.log("12223",resolve)
      }).catch(() => console.log('Oops errors!'))
    });
  }

  //删除取消
  deleteCancel() {
    this.isDeleteVisible = false;
  }

  //确认删除组织架构
  deleteOrganize(resolve) {
    //新写入数据
    let params = {
      "csysOrgStruceId": this.organizeId,
      "csysOrgStruceIsDelete": "1",
    }
    //删除页面
    this.httpService.putHttp(this.organizeUrl, params).subscribe((data: any) => {
      //关闭弹窗
      resolve();
      //根据组织架构编号编号查询权限页面
      let params = {
        "csysOrgStruceId": this.organizeId,
      }
      this.httpService.postHttp(this.permissionUrl + "/listCondition", params).subscribe((data: any) => {
        data = data.data.list;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let params = {
              "csysOrgAuthId  ": data[i].cySysOrganizationalStructurePermissionId,
              "csysOrgAuthIsDelete": "1"
            }
            //删除组织架构权限页面
            this.httpService.putHttp(this.permissionUrl, params).subscribe((data: any) => {
              if (i == data.length - 1) this.msg.create('success', `删除成功！`);
            });
          }
        } else this.msg.create('success', `删除成功！`);
      });
      this.isDeleteVisible = false;
      //重新获取工作流
      this.getOrganize(1);
    });
  }

  handleOk(): void {
    this.isOkLoading = true;
    window.setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.msg.create('success', `保存成功！`);
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isDeleteVisible = false;
    //this.msg.create('success', `取消成功！`);
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.pageList.forEach(item => item.checked = true);
    } else {
      this.pageList.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked(): void {
    if (this.pageList.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.pageList.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  navigatedetail(item): void {
    let queryParams = {};
    queryParams['csysOrgStruceId'] = item.csysOrgStruceId;

    this.router.navigate(['/authority/organizationalchart/'], {
      queryParams
    });
    //this.router.navigate(['/authority/organizationalchart/' + item.csysOrgStruceId + '']);
    console.log("zeq", item.csysOrgStruceId);
  }

  
  searchOrganizationalList(): void {
    let temporayArray;
    let temporayArray1 = [];
    this.httpService.getHttp("/csysorgstruce").subscribe((data: any) => {
      temporayArray = data.data.list;
      if (this.searchContent != "") {
        for (let i = 0; i < temporayArray.length; i++) {
         // this._logger.info("data", temporayArray[i].cySysOrganizationalStructureName);
          if (temporayArray[i].csysOrgStruceName.indexOf(this.searchContent) != -1) {
            temporayArray1.push(temporayArray[i]);
          }
        }

        if (temporayArray1.length == 0) {
          this.pageId = 1;
        } else {
          this.pageId = temporayArray1.length;
        }

        this.data = temporayArray1;
      } else {
        this.data = [];
        this.getOrganize(this.pageId);
      }

    });
  }
  resetingOrganizationList(): void {
    this.data = [];
    this.searchContent = ""
    this.getOrganize(this.pageId);
  }
}
