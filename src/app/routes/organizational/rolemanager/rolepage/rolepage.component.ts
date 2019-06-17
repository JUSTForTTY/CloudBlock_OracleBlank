import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as shape from 'd3-shape';
import * as graph from '@swimlane/ngx-graph';
import { HttpService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


const titles = [
  '页面一',
  '页面二',
  '页面三',
  '页面四',
  '页面五',
  '页面六',
  '页面七',
  '页面八',
];

const avatars = [
  'assets/img/icon-quan.png', // Alipay
  'assets/img/icon-quan.png', // Angular
  'assets/img/icon-quan.png', // Ant Design
  'assets/img/icon-quan.png', // Ant Design Pro
  'assets/img/icon-quan.png', // Bootstrap
  'assets/img/icon-quan.png', // React
  'assets/img/icon-quan.png', // Vue
  'assets/img/icon-quan.png', // Webpack
];
const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/HrxcVbrKnCJOZvtzSqjN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/alaPpKWajEbIYEUvvVNf.png',
  'https://gw.alipayobjects.com/zos/rmsportal/RLwlKSYGSXGHuWSojyvp.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '页面，用户信息交流的核心',
  '页面，用户信息交流的核心',
  '页面，用户信息交流的核心',
  '页面，用户信息交流的核心',
  '页面，用户信息交流的核心',
];

const user = [
  '天天',
  '小tree',
  '荣耀',
  '青龙',
  '降龙',
  '斌斌',
  'cy',
  '泛游',
  '绿萝哥',
  '小石',
  '大古',
  'hansel',
];

@Component({
  selector: 'rolepage',
  templateUrl: './rolepage.component.html',
  styleUrls: ['./rolepage.component.less']
})
export class RolepageComponent implements OnInit {
  q: any = {
    status: 'all',
  };
  loading = false;
  isVisible = false;
  isOkLoading = false;
  //搜索内容
  searchContent;
  transferlist = [];
  pageList;
  checkedarray = [];
  checkOptionsOne;
  pageId = 1;
  pageNum;
  roleId;
  roleName;
  constructor(private fb: FormBuilder, private msg: NzMessageService, private httpService: HttpService, private route: ActivatedRoute, ) {

  }

  public ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('roleId')
    this.getPageList(1);
    this.getRoleName();
    this.getTransferData();
  }



  // getFakeList(count: number = 20): any[] {
  //   const list = [];
  //   for (let i = 0; i < count; i += 1) {
  //     list.push({
  //       id: `fake-list-${i}`,
  //       owner: user[i % 10],
  //       title: titles[i % 8],
  //       avatar: avatars[i % 8],
  //       cover:
  //         parseInt((i / 4).toString(), 10) % 2 === 0
  //           ? covers[i % 4]
  //           : covers[3 - i % 4],
  //       status: ['active', 'exception', 'normal'][i % 3],
  //       percent: Math.ceil(Math.random() * 50) + 50,
  //       logo: avatars[i % 8],
  //       checkOptions: [
  //         { label: '新增信息', value: '1', checked: true },
  //         { label: '删除信息', value: '2', checked: false },
  //         { label: '查询信息', value: '3', checked: false },
  //         { label: '修改信息', value: '4', checked: false },
  //         { label: '批量流转', value: '5', checked: false },
  //         { label: '复制信息', value: '6', checked: false },
  //         { label: '附件上传', value: '7', checked: false },
  //         { label: '导入信息', value: '8', checked: false },
  //         { label: '附件删除', value: '9', checked: false },
  //         { label: '移动数据', value: '10', checked: false }
  //       ],
  //       checkedall: false,
  //       href: 'https://ant.design',
  //       updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
  //       createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
  //       subDescription: desc[i % 5],
  //       description:
  //         '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
  //       activeUser: Math.ceil(Math.random() * 100000) + 100000,
  //       newUser: Math.ceil(Math.random() * 1000) + 1000,
  //       star: Math.ceil(Math.random() * 100) + 100,
  //       like: Math.ceil(Math.random() * 100) + 100,
  //       message: Math.ceil(Math.random() * 10) + 10,
  //       content:
  //         '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
  //       members: [
  //         {
  //           avatar:
  //             'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
  //           name: '曲丽丽',
  //         },
  //         {
  //           avatar:
  //             'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
  //           name: '王昭君',
  //         },
  //         {
  //           avatar:
  //             'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
  //           name: '董娜娜',
  //         },
  //       ],
  //     });
  //   }

  //   return list;
  // }

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


  showModal(): void {
    this.isVisible = true;
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
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.msg.create('success', `取消成功！`);
  }

  checkall(checkstatus: boolean, value: object[]): void {
    if (checkstatus) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const element = value[key];
          console.log(element)
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const element2 = element[key];
              if (key == 'checked') {
                element[key] = true;
              }
            }
          }

        }
      }
    } else {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const element = value[key];
          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              const element2 = element[key];
              if (key == 'checked') {
                element[key] = false;
              }

            }
          }

        }
      }
    }

  }
  checkboxlog(value: object[]): void {
    console.log(value);
  }
  getPageList(event): void {
    let array;
    this.httpService.postHttp("/csyspage/listCondition" + '?page=' + event + '&size=5').subscribe((data: any) => {
      let pageList = data.data.list;
      this.pageNum = data.data.total;
      this.httpService.postHttp("/csyspageblock/condition").subscribe((data: any) => {
        let pageBlockList = data.data;
        for (let i = 0; i < pageList.length; i++) {
          pageList[i]["checkOptions"] = [];
          for (let j = 0; j < pageBlockList.length; j++) {
            //页面id是否相等
            if (pageList[i].csysPageId == pageBlockList[j].csysPageId) {
              //是否存在权限
              if (pageBlockList[j].csysPageBlockAuthority != null && pageBlockList[j].csysPageBlockAuthority != "") {
                array = JSON.parse(pageBlockList[j].csysPageBlockAuthority);
                //权限是否为空
                if (array.length != 0) {
                  let index = 0;
                  for (let k = 0; k < array.length; k++) {
                    if (array[k] == this.roleId) {
                      console.log("张", array[k]);
                      let listData = { label: pageBlockList[j].cySysBlockName, value: pageBlockList[j].cySysPageBlockId, checked: true }
                      pageList[i].checkOptions.push(listData);
                    } else {
                      index++;
                      //当上层if一次没触发时候才会新增进数组，避免页面的checkbox重复
                      if (index == array.length) {
                        let listData = { label: pageBlockList[j].cySysBlockName, value: pageBlockList[j].cySysPageBlockId, checked: false }
                        pageList[i].checkOptions.push(listData);
                      }
                    }
                  }
                } else {

                  let listData = { label: pageBlockList[j].cySysBlockName, value: pageBlockList[j].cySysPageBlockId, checked: false }
                  pageList[i].checkOptions.push(listData);
                }
              } else {
                let listData = { label: pageBlockList[j].cySysBlockName, value: pageBlockList[j].cySysPageBlockId, checked: false }
                pageList[i].checkOptions.push(listData);
              }

            }
          }
        }
        this.pageList = pageList;
        console.log("pagelist", this.pageList);
        console.log("event", event)
        console.log("roleId", this.roleId)


      })
    })
  }
  //获取角色名称
  getRoleName() {
    this.httpService.postHttp("/csysrole/listCondition").subscribe((data: any) => {
      let userData = data.data.list;
      for (let index = 0; index < userData.length; index++) {
        if (userData[index].csysRoleId == this.roleId) {
          this.roleName = userData[index].csysRoleName;
          break;
        }
      }


    });
  }
  //权限修改
  confirm(item): void {
    let itemData = item;
    console.log("ietm", item);
    if (itemData.checkOptions.length != 0) {
      this.httpService.postHttp("/csyspageblock/condition").subscribe((data: any) => {
        let pageBlock = data.data;
        console.log("data", data);
        for (let i = 0; i < itemData.checkOptions.length; i++) {
          //item页面组件的id
          let value = itemData.checkOptions[i].value;
          for (let j = 0; j < pageBlock.length; j++) {
            //判断cySysPageBlockId 和 页面组件中的id
            if (pageBlock[j].csysPageBlockId == value) {
              //判空，不存在直接插入
              if (pageBlock[j].csysPageBlockAuthority != null) {
                console.log("zzzzzzzzzasdasda3");
                let roles = JSON.parse(pageBlock[j].csysPageBlockAuthority);
                let rolesDemo = roles;
                //判断角色是否存在权限
                if (itemData.checkOptions[i].checked == true) {
                  let num = 0;
                  for (let k = 0; k < roles.length; k++) {
                    if (roles[k] == this.roleId) {
                      break;
                    } else {
                      //用于储存字符串
                      let roleId;
                      num++;
                      if (num == roles.length) {
                        roles.push(this.roleId);
                        roleId = '["' + roles[0] + '"';
                        for (let index = 1; index < roles.length; index++) {
                          roleId += ',"' + roles[index] + '"';
                          if (index == roles.length - 1) {
                            roleId += ']';
                          }
                        }
                        let idData = {
                          "csysPageBlockId": itemData.checkOptions[i].value,
                          "csysPageBlockAuthority": roleId
                        }
                        this.httpService.putHttp("/csyspageblock", idData).subscribe((data: any) => {
                        });
                        break;
                      }
                    }
                  }
                } else {
                  let roleId1;
                  for (let index = 1; index < rolesDemo.length; index++) {
                    if (rolesDemo[index] == this.roleId) {
                      rolesDemo.splice(index, 1);
                      console.log("zzzzzzzzz123", rolesDemo);
                      break;
                    }
                  }
                  if (rolesDemo.length > 1) {
                    roleId1 = '["' + roles[0] + '"';
                    for (let index = 1; index < rolesDemo.length; index++) {
                      roleId1 += ',"' + rolesDemo[index] + '"';
                      if (index == rolesDemo.length - 1) {
                        roleId1 += ']';
                      }
                    }
                  } else {
                    if (rolesDemo.length = 1) {
                      roleId1 = '["-1"]';

                    }
                  }
                  console.log("zzzzzzzzzaaa", roleId1);
                  let idData = {
                    "csysPageBlockId": itemData.checkOptions[i].value,
                    "csysPageBlockAuthority": roleId1
                  }
                  this.httpService.putHttp("/csyspageblock", idData).subscribe((data: any) => {
                    console.log(itemData.checkOptions[i].label, rolesDemo);
                  });

                }
                //console.log("json", roles);
              } else {
                console.log("123")
                //当权限为空时候直接插入      
                if (itemData.checkOptions[i].checked == true) {
                  let a = '["' + this.roleId + '"]';
                  let idData = {
                    "csysPageBlockId": itemData.checkOptions[i].value,
                    "csysPageBlockAuthority": a
                  }
                  this.httpService.putHttp("/csyspageblock", idData).subscribe((data: any) => {
                  });
                }

              }
            }
          }
        }
      });
    }

    console.log(itemData);

  }

  a(item): void {

  }
}
