import { Component, OnInit, ViewEncapsulation, KeyValueDiffers } from '@angular/core';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'ngx-block-core';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'rolemanager',
  templateUrl: './rolemanager.component.html',
  styleUrls: ['./rolemanager.component.less']
})
export class RolemanagerComponent implements OnInit {
  form: FormGroup;
  loading = false;
  data: any[] = [];
  isVisible = false;
  isOkLoading = false;
  transferlist = [];
  roleList: any[] = [];
  temporayRoleList: any[] = [];
  isVisibleUsergroup = false;
  isOkLoadingUsergroup = false;
  editRoleVisible = false;
  searchValue;
  roleListTitle = "添加用户组";
  pagenum: number;
  //用户组id
  roleMainId;
  //当前页面id
  pageId: number = 1;
  //搜索内容
  searchContent = "";
  //树形控件数据源
  nodes;
  //选中树形控件
  defaultCheckedKeys = [""];
  //用户组菜单
  userMenu;
  userMenuDemo = [];
  roleId;
  roleName;
  isSpinning = false;
  constructor(private fb: FormBuilder, private msg: NzMessageService, private httpService: HttpService, ) {

  }

  public ngOnInit(): void {
    this.isSpinning = true;
    this.getRoleList(1);
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      comment: [null]

    });

  }
  //获取所有用户组数据
  getRoleList(event: number): void {
    this.pageId = event;
    this.httpService.postHttp("/csysrole/listCondition" + '?page=' + event + '&size=5').subscribe((data: any) => {
      console.log("用户组数据",data.data.list)
      this.roleList = data.data.list;
      this.pagenum = data.data.total;
      this.isSpinning = false;
    });
  }
  //编辑用户组
  editRole(id, name, desc): void {
    this.roleMainId = id;
    this.roleListTitle = "编辑用户组";
    this.isVisibleUsergroup = true;
    this.form = this.fb.group({
      name: [name, [Validators.required]],
      comment: [desc]
    });
  }
  //删除用户组
  deleteRole(id): void {
    this.httpService.deleteHttp("/csysrole/" + id).subscribe((data: any) => {
      //判断当前页是否还有数据，没有返回上一步
      if (this.roleList.length == 1 && this.pagenum > 5) {
        this.pageId = this.pageId - 1;
      }
      this.getRoleList(this.pageId);
    });
  }


  transferselect(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  transferchange(ret: {}): void {
    console.log('nzChange', ret);
  }


  //确认
  handleOk(): void {
    this.isVisible = false;
    //删除原来的权限
    //初始化userMenu将页面选中的checkbox覆盖原来的usermenu
   
    if (this.userMenuDemo.length != 0) {

      this.httpService.getHttp("/csysmenuauth").subscribe((data: any) => {
        let userMenu = data.data.list;
        let userMenuId = [];
        for (const key in userMenu) {
          if (userMenu[key].csysRoleId == this.roleId) {
            userMenuId.push(userMenu[key].csysMenuAuthId);
          }

        }
        //  this._logger.info("试试", userMenuId);
        for (const key in userMenuId) {
          this.httpService.deleteHttp("/csysmenuauth/" + userMenuId[key]).subscribe((data: any) => {
            // this._logger.info("试试", userMenuId[key]);
          });
        }
      });
      for (let i = 0; i < this.userMenuDemo.length; i++) {
        //第一种情况就，菜单下面无子菜单
        if (this.userMenuDemo[i].children.length == 0 && this.userMenuDemo[i].parentNode == null) {
          let data = {
            "csysMenuId": this.userMenuDemo[i].key,
            "csysMenuName": this.userMenuDemo[i].title,
            "csysRoleId": this.roleId,
            "csysRoleName": this.roleName,
            "csysMenuAuthHaschild": "0"
          }
          this.userMenu.push(data);
        }
        //第二种情况，子菜单全部选中
        if (this.userMenuDemo[i].children.length != 0 && this.userMenuDemo[i].parentNode == null) {
          let data1 = {
            "csysMenuId": this.userMenuDemo[i].key,
            "csysMenuName": this.userMenuDemo[i].title,
            "csysRoleId": this.roleId,
            "csysRoleName": this.roleName,
            "csysMenuAuthHaschild": "1"
          }
          this.userMenu.push(data1);
          for (let j = 0; j < this.userMenuDemo[i].children.length; j++) {
            let data = {
              "csysMenuId": this.userMenuDemo[i].children[j].key,
              "csysMenuName": this.userMenuDemo[i].children[j].title,
              "csysRoleId": this.roleId,
              "csysRoleName": this.roleName
            }
            this.userMenu.push(data);
          }
        }
        //第三种情况，子菜单未全部选中
      if (this.userMenuDemo[i].children.length == 0 && this.userMenuDemo[i].parentNode != null) {
        let num = 0;
        for(let k = 0;k< this.userMenu.length;k++){
       
          if(this.userMenu[k].cySysMenuId == this.userMenuDemo[i].parentNode.key){
            num++;
          }
        }
        if(num == 0){
          let data = {
            "csysMenuId": this.userMenuDemo[i].parentNode.key,
            "csysMenuName": this.userMenuDemo[i].parentNode.title,
            "csysRoleId": this.roleId,
            "csysRoleName": this.roleName,
            "csysMenuAuthHaschild": "1"
          }
          this.userMenu.push(data);
        }     
        let data1 = {
          "csysMenuId": this.userMenuDemo[i].key,
          "csysMenuName": this.userMenuDemo[i].title,
          "csysRoleId": this.roleId,
          "csysRoleName": this.roleName
        }
        this.userMenu.push(data1);
        }
        //判断是否存在父
        // if (this.userMenuDemo[i].parentNode != null) {
        //   let data1 = {
        //     "cySysMenuId": this.userMenuDemo[i].parentNode.key,
        //     "cySysMenuName": this.userMenuDemo[i].parentNode.title,
        //     "cySysRoleId": this.roleId,
        //     "cySysRoleName": this.roleName,
        //     "cySysMenuIsParentId": "1"
        //   }
        //   this.userMenu.push(data1);
        // }
      }
      for (const key in this.userMenu) {
        this.httpService.postHttp("/csysmenuauth", this.userMenu[key]).subscribe((data: any) => {
          // this.httpService.postHttp("/cysysbaseusermenu/condition").subscribe((data1: any) => {
          //   let menuUser = [];
          //   let str: string;
          //   for (const i in data1.data) {
          //     if (data1.data[i].cySysMenuId == this.userMenu[key].cySysMenuId) {
          //       menuUser.push(data1.data[i].cySysRoleId);
          //     }
          //   }

          //   if (menuUser.length == 1) {
          //     str = '["' + menuUser[0] + '"]';
          //   } 

          //   if (menuUser.length > 1) {
          //     str = '["' + menuUser[0] + '",';
          //     for (let i = 1; i < menuUser.length; i++) {
          //       if (i == menuUser.length - 1){
          //         str += '"' + menuUser[i] +'"]'
          //       }else{
          //         str += '"' + menuUser[i] + '",'
          //       }
          //     }
          //   }
          //   let menu = [{
          //     "cySysMenuId":this.userMenu[key].cySysMenuId,
          //     "acl":str
          //   }]
          //   this._logger.info("succcc",menu)
          //   this.httpService.putHttp("/cysysmenu",menu).subscribe((data1: any) => {

          //   });
          //   this._logger.info("data123", str);
          // });
        });
      }
      this.msg.create('success', `保存成功！`);
    } else {

    }


    // window.setTimeout(() => {

    //   this.isOkLoading = false;

    // }, 3000);
  }
  //取消
  handleCancel(): void {
    this.userMenuDemo = [];
    this.isVisible = false;
    this.msg.create('success', `取消成功！`);
  }
  mouseAction(name: string, e: any): void {
    this.userMenu = [];
    this.userMenuDemo = [];//初始化
    this.userMenuDemo = e.nodes;

  }

  showUsergroupModal(): void {
    this.roleListTitle = "添加用户组";
    this.isVisibleUsergroup = true;

  }
  //创建编辑用户组，根据title的名称来识别是编辑还是新增
  handleUsergroupOk(): void {
    this.isOkLoadingUsergroup = true;
    if (this.roleListTitle == "添加用户组") {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
      if (this.form.controls.name.invalid) return;
      let roleContent = {
        "csysRoleName": this.form.controls.name.value,
        "csysRoleDesc": this.form.controls.comment.value
      };
      this.httpService.postHttp("/csysrole", roleContent).subscribe((data: any) => {
        this.form = this.fb.group({
          name: [null, [Validators.required]],
          comment: [null]
        });
        this.getRoleList(this.pageId);
        this.msg.create('success', '创建成功');
      });

    } else if (this.roleListTitle == "编辑用户组") {
      for (const i in this.form.controls) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
      if (this.form.controls.name.invalid) return;
      let roleContent = {
        "csysRoleId": this.roleMainId,
        "csysRoleName": this.form.controls.name.value,
        "csysRoleDesc": this.form.controls.comment.value
      };
      this.httpService.putHttp("/csysrole", roleContent).subscribe((data: any) => {
        this.form = this.fb.group({
          name: [null, [Validators.required]],
          comment: [null]
        });
        this.getRoleList(this.pageId);
        this.msg.create('success', '修改成功');
      });
    }
    this.isVisibleUsergroup = false;
  }
  //查询
  serachRoleList(): void {
    let temporayArray;
    let temporayArray1 = [];
    this.httpService.getHttp("/csysrole").subscribe((data: any) => {
      temporayArray = data.data.list;
      if (this.searchContent != "") {
        for (let i = 0; i < temporayArray.length; i++) {
          if ((temporayArray[i].csysRoleName + "").indexOf(this.searchContent) != -1) {
            temporayArray1.push(temporayArray[i]);
          }
        }

        if (temporayArray1.length == 0) {
          this.pagenum = 1;
        } else {
          this.pagenum = temporayArray1.length;
        }

        this.roleList = temporayArray1;

      } else {
        this.roleList = [];
        this.getRoleList(this.pageId);
      }
    });

  }
  //重置列表
  resetingRoleList(): void {
    this.roleList = [];
    this.searchContent = "";
    this.getRoleList(this.pageId);
  }

  handleUsergroupCancel(): void {
    this.isVisibleUsergroup = false;
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      comment: [null]
    });
  }
  //打开用户组菜单弹出框
  showModal(roleid, rolename): void {
    this.userMenuDemo = [];
    this.isVisible = true;
    this.getMenuList(roleid);
    this.roleId = roleid;
    this.roleName = rolename;
  }
  getMenuList(roleid): void {
    this.httpService.postHttp("/csysmenu/tree").subscribe((data: any) => {
      this.nodes = data.data;
      this.getdefaultCheckedKeys(roleid);
    });
  }
  //获取默认值
  getdefaultCheckedKeys(roleid): void {
    let roleMenuList = [];
    this.userMenu = [];
    this.defaultCheckedKeys = [""];
    this.httpService.getHttp("/csysmenuauth").subscribe((data: any) => {
      roleMenuList = data.data.list;
      for (const key in roleMenuList) {
        if (roleMenuList[key].csysRoleId == roleid && roleMenuList[key].csysMenuAuthHaschild != "1") {
          let data = {
            "csysMenuId": roleMenuList[key].csysMenuId,
            "csysMenuName": roleMenuList[key].csysMenuName,
            "csysRoleId": roleMenuList[key].csysRoleId,
            "csysRoleName": roleMenuList[key].csysRoleName
          }
          this.userMenu.push(data);
          this.defaultCheckedKeys.push(roleMenuList[key].csysMenuId);
        }
      }

      this.defaultCheckedKeys = [...this.defaultCheckedKeys];
    });
  }
}
