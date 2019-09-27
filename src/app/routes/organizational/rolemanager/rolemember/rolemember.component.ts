import { Component, Directive, OnInit, ViewContainerRef, Input, NgModule, OnDestroy } from "@angular/core";
import { NzMessageService, NzModalService, NzTreeNode } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { tap, map } from 'rxjs/operators';
import { HttpService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { PageService } from 'ngx-block-core';
import {
  STComponent, STColumn, STData
} from '@delon/abc';


const list = [];
for (let i = 0; i < 46; i += 1) {
  list.push({
    key: i,
    disabled: i % 6 === 0,
    href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    no: `TradeCode ${i}`,
    title: `<nz-avatar nzText='U'></nz-avatar>小树${i}`,
    owner: '树',
    department: '部门',
    sex: '性别',
    organization: '组织',
    usergroup: '用户组',
    status: Math.floor(Math.random() * 10) % 4,
    description: '这是一段描述',
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    progress: Math.ceil(Math.random() * 100),
  });
}
@Component({
  selector: 'rolemember',
  templateUrl: './rolemember.component.html',
  styleUrls: ['./rolemember.component.css']
})
export class RolememberComponent implements OnInit {

  addUserForm: FormGroup;
  nzTitle;
  roleId;
  q: any = {
    pi: 1,
    ps: 10,
    sorter: '',
    status: null,
    statusList: [],
  };
  data: any[] = [];
  searchloading = false;
  loading = false;
  buttonloading = false;
  isVisible = false;
  isOkLoading = false;
  urValue = null;
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;
  // region: cateogry
  categories;
  searchValue;
  show = true;
  queryParamStr = '';
  path;
  roleDisabled = true;
  constructor(private fb: FormBuilder, private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private httpService: HttpService,
    private route: ActivatedRoute, private pageService: PageService) { }

  ngOnInit() {
    // this.route.queryParams.subscribe(queryParams => {
    //   this.roleId = queryParams['roleId'];
    // });
    this.path = this.pageService.getPathByRoute(this.route);
    //  path 可不传
    //  this.activatedRoute 需保证准确
    this.roleId=this.pageService.getRouteParams(this.route, 'roleId',this.path)

    // this.getData();
    // this.getUsersList();
    // this.getRoleList();
    // //this.getResource();
    // this.initializeFromControl();
    // this.getMenuList();
    // this.getTreeData();
    this.path = this.pageService.getPathByRoute(this.route);
    //监听路径参数
    this.pageService.setRouteParamsByRoute(this.route, this.path);
    //初始化参数识别字串
    this.queryParamStr = '';
    for (const key in this.pageService.routeParams[this.path]) {
        if (this.pageService.routeParams[this.path].hasOwnProperty(key)) {
            this.queryParamStr = this.queryParamStr + this.pageService.routeParams[this.path][key];
        }
    }
    //初始化代码
    this.baseInit();
    //this.roleId = this.route.snapshot.paramMap.get("roleId");
  }
  baseInit() {
    this.urValue = this.roleId;
    this.getUsersList();
    this.getRoleList();
    //this.getResource();
    this.initializeFromControl();
    this.getMenuList();
    this.getTreeData();
  }
  _onReuseInit() {
    let newStr = '';
    for (const key in this.pageService.routeParams[this.path]) {
      if (this.pageService.routeParams[this.path].hasOwnProperty(key)) {
        newStr = newStr + this.pageService.routeParams[this.path][key];
      }
    }
    if (newStr != '' && newStr != this.queryParamStr) {
      this.queryParamStr = newStr;
      // 此处是刷新逻辑 根据具体情况编写 start
      this.show = false;
      this.baseInit();
      setTimeout(() => {
        this.show = true;
      }, 5);
      // 此处是刷新逻辑 end
    }
  }
  checkboxChange(list: STData[]) {
    this.selectedRows = list;
    this.totalCallNo = this.selectedRows.reduce(
      (total, cv) => total + cv.callNo,
      0,
    );
  }


  changeCategory(chickid) {
    this.roleId = chickid;
    this.usersData = [];
    //this.urValue = chickid;
    console.log('data', this.usersListData1)
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].csysRoleId != chickid) {
        this.categories[i]['nzChecked'] = "false";
      } else {
        this.categories[i]['nzChecked'] = "true";
      }
    }
    if (chickid != "allRole") {
      for (let i = 0; i < this.usersListData1.length; i++) {
        for (let j = 0; j < this.usersListData1[i].userRoleId.length; j++) {
          if (this.usersListData1[i].userRoleId[j] == chickid) {
            this.usersData.push(this.usersListData1[i])
            break;
          }
        }
      }
    } else {
      this.usersData = this.usersListData1;
    }

    this.usersData = [...this.usersData]


  }


  showModal(): void {
    this.editState = false;
    this.uInspect = false;
    this.nzTitle = "添加成员";
    this.initializeFromControl();
    this.isRoleVisible = true;
    this.addUserForm.get("username").enable();
  }
  nzBtnLoding = false;
  handleOk(): void {
    //校验控件控件
    for (const i in this.addUserForm.controls) {
      this.addUserForm.controls[i].markAsDirty();
      this.addUserForm.controls[i].updateValueAndValidity();
    }
    if (this.addUserForm.controls.name.invalid) return;
    if (this.addUserForm.controls.username.invalid) return;
    if (this.addUserForm.controls.password.invalid) return;
    if (this.addUserForm.controls.confitmPassword.invalid) return;
    if (this.addUserForm.controls.department.invalid) return;
    if (this.addUserForm.controls.position.invalid) return;
    this.nzBtnLoding = true;
    if (this.nzTitle == "编辑成员") {
      this.submitEdit(this.editUserId);
    } else if (this.nzTitle == "添加成员") {
      this.insertUser();
    }
    // this.initializeFromControl();
  }
  submitNum;
  submitTimer;
  //编辑提交 --> 用户组和组织架构为不必填是否需要判空执行定时器（默认全部必填）
  // submitEdit(userId): void {
  //   let userData
  //   this.submitNum = 0;
  //   //校验控件
  //   for (const i in this.addUserForm.controls) {
  //     this.addUserForm.controls[i].markAsDirty();
  //     this.addUserForm.controls[i].updateValueAndValidity();
  //   }
  //   if (this.addUserForm.controls.name.invalid) return;
  //   if (this.addUserForm.controls.username.invalid) return;
  //   if (this.addUserForm.controls.password.invalid) return;
  //   if (this.addUserForm.controls.confitmPassword.invalid) return;
  //   if (this.addUserForm.controls.department.invalid) return;
  //   if (this.addUserForm.controls.position.invalid) return;
  //   if (this.addUserForm.controls.email.invalid) return;
  //   this.editOrginzation(userId);
  //   this.editUserRole(userId);
  //   this.editUserRs(userId)
  //   if (this.addUserForm.controls.password != this.password && this.addUserForm.controls.confitmPassword != this.password) {
  //     userData = {
  //       "csysUserId": userId,
  //       "csysUserUsername": this.addUserForm.controls.username.value,//用户名
  //       "csysUserPassword": this.addUserForm.controls.password.value,//密码
  //       "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
  //       "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
  //       "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
  //       "csysUserGender": this.addUserForm.controls.gender.value,//性别
  //       "csysUserAge": this.addUserForm.controls.age.value,//年龄
  //       "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
  //       "csysUserAddress": this.addUserForm.controls.address.value//地址
  //     }
  //   } else {
  //     userData = {
  //       "csysUserId": userId,
  //       "csysUserUsername": this.addUserForm.controls.username.value,//用户名
  //       "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
  //       "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
  //       "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
  //       "csysUserGender": this.addUserForm.controls.gender.value,//性别
  //       "csysUserAge": this.addUserForm.controls.age.value,//年龄
  //       "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
  //       "csysUserAddress": this.addUserForm.controls.address.value//地址
  //     }
  //   }

  //   console.log("zeq", userData);
  //   //添加用户
  //   this.httpService.putHttp("/csysuser", userData).subscribe((data: any) => {
  //     this.submitNum++;
  //   });
  //   this.submitTimer = setInterval(() => {
  //     if (this.submitNum == 3) {
  //       this.nzBtnLoding = false;
  //       this.msg.create("success", "编辑成功");
  //       this.isRoleVisible = false;
  //       this.getUsersList();
  //       clearInterval(this.submitTimer);
  //     }
  //   }, 500);
  // }
  editState = false;
  submitEdit(userId): void {
    
    let userData
    this.submitNum = 0;
    //校验控件
    for (const i in this.addUserForm.controls) {
      this.addUserForm.controls[i].markAsDirty();
      this.addUserForm.controls[i].updateValueAndValidity();
    }
    if (this.addUserForm.controls.name.invalid) return;
    if (this.addUserForm.controls.username.invalid) return;
    if (this.addUserForm.controls.password.invalid) return;
    if (this.addUserForm.controls.confitmPassword.invalid) return;
    if (this.addUserForm.controls.department.invalid) return;
    if (this.addUserForm.controls.position.invalid) return;
    this.editOrginzation(userId);
    this.editUserRole(userId);
    //this.//editUserRs(userId);
    let abc = "SSSfffss123_"
    console.log("当前密码", abc.toUpperCase())
    //判断密码是否修改

    if (this.addUserForm.controls.password.value == this.password && this.addUserForm.controls.confitmPassword.value == this.password) {

      userData = {
        "csysUserId": userId,
        "csysUserUsername": this.addUserForm.controls.username.value.toUpperCase(),//用户名
        "csysUserHp": this.addUserForm.controls.numType.value,
        "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
        "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
        "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
        "csysUserGender": this.addUserForm.controls.gender.value,//性别
        "csysUserAge": this.addUserForm.controls.age.value,//年龄
        "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
        "csysUserAddress": this.addUserForm.controls.address.value//地址
      }
    } else {
      userData = {
        "csysUserId": userId,
        "csysUserUsername": this.addUserForm.controls.username.value.toUpperCase(),//用户名
        "csysUserPassword": this.addUserForm.controls.password.value,//密码
        "csysUserHp": this.addUserForm.controls.numType.value,
        "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
        "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
        "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
        "csysUserGender": this.addUserForm.controls.gender.value,//性别
        "csysUserAge": this.addUserForm.controls.age.value,//年龄
        "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
        "csysUserAddress": this.addUserForm.controls.address.value//地址
      }

    }
    console.log("zeq", userData);
    //添加用户
    this.httpService.putHttp("/csysuser", userData).subscribe((data: any) => {
      this.submitNum++;
    });
    this.submitTimer = setInterval(() => {
      console.log("sb1",this.num)
      if (this.submitNum == 3) {
        this.urValue = this.roleId;
        this.nzBtnLoding = false;
        this.msg.create("success", "编辑成功");
        this.nzTitle = "权限分配";
        this.isRoleVisible = false;
        this.getUsersList();
        clearInterval(this.submitTimer);
      }
    }, 500);
  }



  editOrginzation(userId): void {
    console.log("zuzhijiagou1");
    //delete from CSYS_ORG_POT_AUTH where csys_user_id = 'LHCsysUser20190710090548388000036'
    //编辑组织架构
    let department = this.addUserForm.controls.department.value;//组织（部门）   
    let organizationArray = [];//组织权限
    this.httpService.postHttp("/csysorgpotauth/condition", { "csysUserId": userId }).subscribe((data: any) => {
      organizationArray = data.data
      console.log("organizationArray", organizationArray);
      //当存在组织架构时候先删除在添加
      for (let i = 0; i < organizationArray.length; i++) {
        let delData = {
          "csysOrgPotAuthId": organizationArray[i].csysOrgPotAuthId,
          "csysOrgPotAuthIsDelete": "1",
        }
        this.httpService.putHttp("/csysorgpotauth", delData).subscribe((data: any) => {
          //添加组织架构
          if (i == organizationArray.length - 1) {
            console.log("department", department);
            //for (let i = 0; i < department.length; i++) {
              let organization = {
                "csysUserId": userId,
                "csysOrgPotId": department
              }
              console.log("123321", organization);
              this.httpService.postHttp("/csysorgpotauth", organization).subscribe((data: any) => {
                //if (i == department.length - 1) {
                  this.submitNum++;
                //}
              });
            //}
          }
        });
      }
      //当改用户不存在组织架构时候
      if (organizationArray.length == 0) {
        //for (let i = 0; i < department.length; i++) {
          let organization = {
            "csysUserId": userId,
            "csysOrgPotId": department
          }
          console.log("123321", organization);
          this.httpService.postHttp("/csysorgpotauth", organization).subscribe((data: any) => {
            //if (i == department.length - 1) {
              this.submitNum++;
            //}
          });
        //}
      }
    });
  }
  //编辑用户组
  editUserRole(userId): void {
    console.log("帅气", userId)
    let position = this.addUserForm.controls.position.value;//用户组
    console.log("position", position)
    let deleteArray = [];
    this.httpService.postHttp("csysuserrole/condition", { "csysUserId": userId }).subscribe((data: any) => {
      deleteArray = data.data;
      console.log("deleteArray", deleteArray)
      //循环删除role表
      for (let i = 0; i < deleteArray.length; i++) {
        let delData = {
          "csysUserRoleId": deleteArray[i].csysUserRoleId,
          "csysUserRoleIsDelete": "1"
        }
        console.log("delData", delData);

        this.httpService.putHttp("/csysuserrole", delData).subscribe((data: any) => {
          if (i == deleteArray.length - 1) {
            for (let i = 0; i < position.length; i++) {
              let userRole = {
                "csysRoleId": position[i],
                "csysUserId": userId
              }
              console.log("userRole1", userRole);
              this.httpService.postHttp("/csysuserrole", userRole).subscribe((data: any) => {
                if (i == position.length - 1) {
                  this.submitNum++;
                }
              });
            }
          }
        });
      }
      //当userRole表中不存在改用户角色执行
      if (deleteArray.length == 0) {
        for (let i = 0; i < position.length; i++) {
          let userRole = {
            "csysRoleId": position[i],
            "csysUserId": userId
          }
          console.log("userRole", userRole);
          this.httpService.postHttp("/csysuserrole", userRole).subscribe((data: any) => {
            if (i == position.length - 1) {
              this.submitNum++;
            }
          });
        }
      }
    });
  }
  // editUserRs(userId): void {
  //   /**
  //    * 编辑用户资源
  //    * author:zeq - 190408
  //    * remark:用户资源是不必填字段，考虑存在表格中可能不存在改用户所属的用户资源，划分两种操作.
  //    */
  //   let position = this.addUserForm.value.accountResource;
  //   console.log("position", this.addUserForm)
  //   let rsData = [];
  //   if (position.length != 0) {
  //     this.httpService.postHttp("userrs/condition").subscribe((data: any) => {
  //       for (let index = 0; index < data.data.length; index++) {
  //         const element = data.data[index];
  //         if (element.csysUserId == userId) {
  //           rsData.push(element.userRsId);
  //         }
  //       }
  //       //存在该用户的用户资源则先删除,不存在直接新增
  //       if (rsData.length != 0) {
  //         //删除
  //         for (let index = 0; index < rsData.length; index++) {
  //           const element = rsData[index];
  //           this.httpService.deleteHttp("/userrs/" + element).subscribe((data: any) => {
  //             //删除完成之后新增
  //             if (index == rsData.length - 1) {
  //               for (let index1 = 0; index1 < position.length; index1++) {
  //                 const element1 = position[index1];
  //                 let rsData = {
  //                   "tResourceId": element1,
  //                   "csysUserId": userId
  //                 }
  //                 this.httpService.postHttp("/userrs", rsData).subscribe((data: any) => { })
  //               }
  //             }
  //           })
  //         }
  //       } else {
  //         //新增
  //         for (let index = 0; index < position.length; index++) {
  //           const element = position[index];
  //           let rsData = {
  //             "tResourceId": element,
  //             "csysUserId": userId
  //           }
  //           this.httpService.postHttp("/userrs", rsData).subscribe((data: any) => { })
  //         }
  //       }
  //     })
  //   } else {
  //     this.deleteUserRs(userId);
  //   }
  // }

  insertTimer;
  insertNum = 0;
  ustarus = false;
  insertUser(): void {
    this.insertNum = 0;
    let userData = {
      "csysUserUsername": this.addUserForm.controls.username.value.toUpperCase(),//用户名
      "csysUserPassword": this.addUserForm.controls.password.value,//密码
      "csysUserHp": this.addUserForm.controls.numType.value,
      "csysUserPhone": this.addUserForm.controls.phone.value,//手机号
      "csysUserRealname": this.addUserForm.controls.name.value,//真实姓名
      "csysUserNumber": this.addUserForm.controls.employeeId.value,//员工号
      "csysUserGender": this.addUserForm.controls.gender.value,//性别
      "csysUserAge": this.addUserForm.controls.age.value,//年龄
      "csysUserEmail": this.addUserForm.controls.email.value,//邮箱
      "csysUserAddress": this.addUserForm.controls.address.value//地址
    }
    //添加用户
    
    this.httpService.postHttp("/csysuser/condition", { "csysUserUsername": this.addUserForm.controls.username.value.toUpperCase() }).subscribe((udata: any) => {
      if (udata.data.length != 0) {
        this.nzBtnLoding = false;
        this.msg.error("该账号已存在");
        return;
      } else {
        this.httpService.postHttp("/csysuser", userData).subscribe((data: any) => {
          this.insertNum++;
          let userId = data.data;
          this.insertUserRole(userId);
          this.insertUserOr(userId);
          //this.insertUserRs(userId);
        });
        this.insertTimer = setInterval(() => {
          console.log("sb3",this.num)
          if (this.insertNum == 3) {
            this.nzBtnLoding = false;
            this.msg.create("success", "创建成功");
            this.isRoleVisible = false;
            this.getUsersList();
            clearInterval(this.insertTimer);
          }
        }, 500);
      }
    })
  }

  insertUserRole(userId): void {
    //添加用户组
    let position = this.addUserForm.controls.position.value;//用户组
    for (let i = 0; i < position.length; i++) {
      let userRole = {
        "csysRoleId": position[i],
        "csysUserId": userId
      }
      console.log("userRole", userRole);
      this.httpService.postHttp("/csysuserrole", userRole).subscribe((data: any) => {
        if (i == position.length - 1) {
          this.insertNum++;
        }
      });
    }
  }

  insertUserOr(userId): void {
    //新增用户组织架构
    let department = this.addUserForm.controls.department.value;//组织（部门）
    console.log("department",department);
    //for (let i = 0; i < department.length; i++) {
      let organization = {
        "csysUserId": userId,
        "csysOrgPotId": department
      }
      //console.log("123321", organization);
      this.httpService.postHttp("/csysorgpotauth", organization).subscribe((data: any) => {
        //if (i == department.length - 1) {
          this.insertNum++;
        //}
      });
    //}
  }

  // insertUserRs(userId): void {
  //   //添加用户资源
  //   let userRs = this.addUserForm.value.accountResource
  //   for (let index = 0; index < userRs.length; index++) {
  //     const element = userRs[index];
  //     let data = {
  //       "tResourceId": element,
  //       "csysUserId": userId,
  //     }
  //     console.log("datadatadata", data);
  //     this.httpService.postHttp("/userrs", data).subscribe((data: any) => {

  //     })
  //   }
  // }

  mouseAction(name: string, e: any): void {
    console.log(name, e);
  }
  searchContent;
  num = 0;
  usersListData;
  usersListData1;
  timer
  nzLoading = false;
  usersData;
  happenUser;
  getUsersList(): void {
    this.usersData = []
    this.num = 0;
    this.nzLoading = true;
    this.httpService.postHttp("/csysuser/condition").subscribe((data1: any) => {
      this.usersListData = data1.data;
      console.log("zzzzz", this.usersListData)
      for (let i = 0; i < this.usersListData.length; i++) {
        this.num = this.num + 2;
        this.getUserOrganization(this.usersListData[i].csysUserId, i);
        this.getUserRole(this.usersListData[i].csysUserId, i);
      }
      this.timer = setInterval(() => {
        //console.log("sb2",this.num)
        if (this.num == 0) {
          this.ngOnDestroy();
          this.nzLoading = false;
          this.usersListData1 = this.usersListData;
          // this.usersListData = [];
          for (let i = 0; i < this.usersListData1.length; i++) {
            for (let j = 0; j < this.usersListData1[i].userRoleId.length; j++) {
              if (this.usersListData1[i].userRoleId[j] == this.roleId) {
                this.usersData.push(this.usersListData1[i])
                break;
              }
            }
          }
          this.roleDisabled = false;
          this.usersData = [...this.usersData];
          this.happenUser = this.usersListData;
          this.changeCategory(this.roleId);
          console.log("sb",this.num)
        
        }
      }, 500);

    });

  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  userOrganization
  //获取用户所属组织架构
  getUserOrganization(userId, index): void {
    let userOrganization = [];
    let Organization = [];
    let OrganizationId ;
    let userIdOrganization;
    this.httpService.postHttp("csysorgpotauth/condition", { "csysUserId": userId }).subscribe((data: any) => {
      this.httpService.getHttp("/csysorgpot").subscribe((data1: any) => {
        this.userOrganization = data.data;
        userOrganization = data1.data.list;
        for (let key = 0; key < this.userOrganization.length; key++) {
          for (const i in userOrganization) {
            if (userOrganization[i].csysOrgPotId == this.userOrganization[key].csysOrgPotId) {
              Organization.push(userOrganization[i].csysOrgPotName);
              OrganizationId = userOrganization[i].csysOrgPotId;
              break;
            }
          }
        }
        userIdOrganization = Organization[0];
        for (let i = 1; i < Organization.length; i++) {
          userIdOrganization += "，" + Organization[i];
        }

        this.usersListData[index]['csysOrgPotName'] = userIdOrganization;
        this.usersListData[index]['csysOrgPotId'] = OrganizationId;
        this.num--;
      });

    });
  }
  userRole;
  //获取用户所属用户组
  getUserRole(userId, index): void {
    let userRoleList = [];
    let role = [];
    let userIdRole;
    let roleId = [];
    this.httpService.postHttp("/csysuserrole/condition", { "csysUserId": userId }).subscribe((data: any) => {
      this.httpService.getHttp("/csysrole").subscribe((data1: any) => {
        role = data1.data.list;
        this.userRole = data.data;
        for (let key = 0; key < this.userRole.length; key++) {
          console.log("userRole11", this.userRole[key])
          for (const i in role) {
            if (role[i].csysRoleId == this.userRole[key].csysRoleId) {
              userRoleList.push(role[i].csysRoleName);
              roleId.push(role[i].csysRoleId);
              break;
            }
          }
        }
        userIdRole = userRoleList[0];
        for (let i = 0; i < userRoleList.length - 1; i++) {
          userIdRole += "，" + userRoleList[i + 1];
        }
        this.usersListData[index]['userRole'] = userIdRole;
        this.usersListData[index]['userRoleId'] = roleId;
        this.num--;
      });
    });
  }
  //获得所有用户组
  getRoleList() {
    this.httpService.postHttp("/csysrole/condition").subscribe((data: any) => {
      this.categories = data.data;
      let a = {
        "csysRoleId": "allRole",
        "csysRoleName": "全部"
      }
      this.categories.unshift(a);
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].csysRoleId != this.roleId) {
          this.categories[i]['nzChecked'] = "false";
        } else {
          this.categories[i]['nzChecked'] = "true";
        }
      }
    })
  }
  //编辑成员
  editUserId;
  isRoleVisible = false;
  password
  editUser(userId): void {
    if (userId == "SUCUCsysUser20190426000036") {
      this.msg.error("系统账号禁止编辑!");
      return;
    }
    this.editState = true;
    this.nzTitle = "编辑成员";
    this.editUserId = userId;
    this.isRoleVisible = true;
    let userData;
    let rsData = [];
    for (let i = 0; i < this.usersListData.length; i++) {
      if (this.usersListData[i].csysUserId == userId) {
        userData = this.usersListData[i];
        break;
      }
    }
    console.log("userData", userData)
    this.password = userData.csysUserPassword;

    this.addUserForm = this.fb.group({
      name: [userData.csysUserRealname, [Validators.required]],
      username: [userData.csysUserUsername, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{0,}$/)]],
      password: [userData.csysUserPassword, [Validators.required]],
      numType: [userData.csysUserHp],
      confitmPassword: [userData.csysUserPassword, [Validators.required, this.confirmationValidator]],
      //accountResource: [rsData],
      age: [userData.csysUserAge],
      gender: [userData.csysUserGender],
      position: [userData.userRoleId, [Validators.required]],//userData.userRoleId
      department: [userData.csysOrgPotId, [Validators.required]],
      phone: [userData.csysUserPhone],
      email: [userData.csysUserEmail, [Validators.email]],
      address: [userData.csysUserAddress],
      employeeId: [userData.csysUserNumber]
    });
    //this.addUserForm.get("username").disable();
  }
  //初始化表单控件
  initializeFromControl(): void {
    this.addUserForm = this.fb.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{0,}$/)]],//Validators.pattern(/[\u4E00-\u9FA5]/g])],
      password: [null, [Validators.required]],
      //accountResource: [null],
      confitmPassword: [null, [Validators.required, this.confirmationValidator]],
      numType: ["0"],
      age: [null],
      gender: ["男"],
      position: [null, [Validators.required]],
      department: [null, [Validators.required]],
      phone: [null],
      email: [null, [Validators.email]],
      address: [null],
      employeeId: [null]
    });

  }
  //校验两次密码是否相同
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.addUserForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }
  //编辑成员取消
  handleRoleCancel(): void {
    this.isRoleVisible = false;
  }
  //获得用户组
  listOfOption;
  getMenuList(): void {
    this.httpService.postHttp("/csysrole/condition").subscribe((data: any) => {
      this.listOfOption = data.data;
    });
  }
  nodes1
  getTreeData(): void {
    this.nodes1 = [];
    let organizeId;
    this.httpService.postHttp("/csysorgstruce/condition").subscribe((data: any) => {
      for (let index = 0; index < data.data.length; index++) {
        const element = data.data[index];
        if (element.csysOrgStruceType == 0) {
          organizeId = element.csysOrgStruceId;
          break;
        }
      }
      let body = {
        "csysOrgStruceId": organizeId
      };
      console.log("body体", body);
      this.httpService.postHttp("/csysorgpot/tree").subscribe((data: any) => {
        this.nodes1 = data.data;
      });
      this.nodes1 = data.data;
    });
  }
  //删除用户
  deleteUser(userId): void {
    if (userId == "SUCUCsysUser20190426000036") {
      this.msg.error("系统账号禁止删除!");
      return;
    }
    let deleteArray = [];
    let organizationArray = [];
    console.log(userId);
    //this.deleteUserRs(userId);
    //获得组织的id
    this.httpService.postHttp("/csysorgpotauth/condition", { "csysUserId": userId }).subscribe((data: any) => {
      organizationArray = data.data;
      for (let i = 0; i < organizationArray.length; i++) {
        let delData = {
          "csysOrgPotAuthId": organizationArray[i].csysOrgPotAuthId,
          "csysOrgPotAuthIsDelete": "1",
        }
        this.httpService.putHttp("/csysorgpotauth", delData).subscribe((data: any) => {
        });
      }
    });
    //并删除该用户组
    this.httpService.postHttp("/csysuserrole/condition", { "csysUserId": userId }).subscribe((data: any) => {
      deleteArray = data.data;
      //循环删除role表
      for (let i = 0; i < deleteArray.length; i++) {
        let delData1 = {
          "csysUserRoleId": deleteArray[i].csysUserRoleId,
          "csysUserRoleIsDelete": "1"
        }
        this.httpService.putHttp("/csysuserrole", delData1).subscribe((data: any) => {
          //外键存在，异步操作，放在里面
          if (i == deleteArray.length - 1) {
            let delData2 = {
              "csysUserId": userId,
              "csysUserIsDelete": "1"
            }
            this.httpService.putHttp("/csysuser", delData2).subscribe((data1: any) => {
              if (data.code == "200") {
                this.msg.create("success", "删除成功");
              }
              this.getUsersList();
            });
          }
        });
      }
      //当userRole表中不存在改用户角色执行
      if (deleteArray.length == 0) {
        let delData2 = {
          "csysUserId": userId,
          "csysUserIsDelete": "1"
        }
        this.httpService.putHttp("/csysuser", delData2).subscribe((data: any) => {
          if (data.code == "200") {
            this.msg.create("success", "删除成功");
          }
          this.getUsersList();
        });
      }
    });
  }
  // deleteUserRs(userId): void {
  //   this.httpService.postHttp("/userrs/condition").subscribe((data: any) => {
  //     for (let index = 0; index < data.data.length; index++) {
  //       const element = data.data[index];
  //       //该用户的资源删除
  //       if (element.csysUserId == userId) {
  //         this.httpService.deleteHttp("/userrs/" + element.userRsId).subscribe((data: any) => { })
  //       }
  //     }
  //   });
  // }
  // resourceData;
  // getResource(): void {
  //   //获取资源数据
  //   this.httpService.postHttp("/tresource/condition").subscribe((data: any) => {
  //     this.resourceData = data.data;
  //   })
  // }
  sendMessage(event): void {
    if (event.charCode == 13) {
      //点击回车键发送消息
      this.serchUserList()
    }
  }
  searchData = []
  serchUserList(): void {
    this.urValue = "allRole";
    this.searchData = [];
    if (this.searchContent) {
      for (let index = 0; index < this.happenUser.length; index++) {
        const element = this.happenUser[index];
        if ((element.csysUserUsername).indexOf(this.searchContent) != -1) {
          this.searchData.push(element);
        }
      }
      this.usersData = this.searchData;
    } else {
      this.usersData = this.happenUser;
    }
  }
  resetingUserList(): void {
    this.usersData = this.happenUser;
  }
  onChange(value) {
    let type = typeof value;
    if (type == "string") {
      //小写转大写
      var reg2: RegExp = /[a-z]/;
      if (reg2.test(value)) {
        value = value.toLocaleUpperCase();
      }
    }
    this.searchContent = value;
  }
  //监听键盘的回车
  keytest(event){
    console.log(event.key);
    if(event.key == "Enter"){
      this.serchUserList();
    }
  }
  uInspect = false;
  //用户名异步校验
  usernameInspect(value):void{
    this.uInspect = false;
    let type = typeof value;
    if (type == "string") {
      //小写转大写
      var reg2: RegExp = /[a-z]/;
      if (reg2.test(value)) {
        value = value.toLocaleUpperCase();
      }
    }
    console.log("用户名",value)
    this.httpService.postHttp("csysuser/condition", {"csysUserUsername": value}).subscribe((data1: any) => {
      if(data1.data.length != 0){
        this.uInspect = true;
      }
    })
  } 
 

}
