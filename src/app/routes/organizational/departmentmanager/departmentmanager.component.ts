import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService,NzTreeNode } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import * as shape from 'd3-shape';
import * as graph from '@swimlane/ngx-graph';
import { AbstractControl, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

const titles = [
  '用户组一',
  '用户组二',
  '用户组三',
  '用户组四',
  '用户组五',
  '用户组六',
  '用户组七',
  '用户组八',
];

const avatars = [
  'assets/img/icon-jiao.png', // Alipay
  'assets/img/icon-jiao.png', // Angular
  'assets/img/icon-jiao.png', // Ant Design
  'assets/img/icon-jiao.png', // Ant Design Pro
  'assets/img/icon-jiao.png', // Bootstrap
  'assets/img/icon-jiao.png', // React
  'assets/img/icon-jiao.png', // Vue
  'assets/img/icon-jiao.png', // Webpack
];
const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/HrxcVbrKnCJOZvtzSqjN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/alaPpKWajEbIYEUvvVNf.png',
  'https://gw.alipayobjects.com/zos/rmsportal/RLwlKSYGSXGHuWSojyvp.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '用户组，权限分配的基础',
  '用户组，权限分配的基础',
  '用户组，权限分配的基础',
  '用户组，权限分配的基础',
  '用户组，权限分配的基础',
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
  selector: 'departmentmanager',
  templateUrl: './departmentmanager.component.html',
  styleUrls: ['./departmentmanager.component.less']
})
export class DepartmentmanagerComponent implements OnInit {
  q: any = {
    status: 'all',
  };
  loading = false;
  data: any[] = [];
  isVisible = false;
  isOkLoading = false;

  transferlist = [];

  searchValue;
  nodes = [
    new NzTreeNode({
      title   : '菜单1001',
      key     : '1001',
      children: [
        {
          title   : '菜单1001-1',
          key     : '10001',
          children: [
            {
              title   : '菜单1001-1-1',
              key     : '100011',
              children: [
                {
                  title : '菜单1001-1-1-功能',
                  key   : '1000111',
                  isLeaf: true
                }
              ]
            },
            {
              title   : '菜单1001-1-2',
              key     : '100012',
              checked : true,
              children: [
                {
                  title : '菜单1001-1-2-功能',
                  key   : '1000121',
                  isLeaf: true
                }
              ]
            }
          ]
        },
        {
          title : '菜单1001-2',
          key   : '10002',
          isLeaf: true
        }
      ]
    }),
    new NzTreeNode({
      title   : '菜单2001',
      key     : '1002',
      children: [
        {
          title   : '菜单2001-1',
          key     : '10021',
          children: []
        },
        {
          title     : '菜单2001-2',
          key       : '10022',
          selectable: false,
          children  : [
            {
              title : '菜单2001-2-功能',
              key   : '100221',
              isLeaf: true
            }
          ]
        }
      ]
    })
  ];
  constructor(private fb: FormBuilder, private msg: NzMessageService,) {
 
  }

  public ngOnInit(): void {


    this.data = this.getFakeList(10);

    this.getTransferData();
  }



  getFakeList(count: number = 20): any[] {
    const list = [];
    for (let i = 0; i < count; i += 1) {
      list.push({
        id: `fake-list-${i}`,
        owner: user[i % 10],
        title: titles[i % 8],
        avatar: avatars[i % 8],
        cover:
          parseInt((i / 4).toString(), 10) % 2 === 0
            ? covers[i % 4]
            : covers[3 - i % 4],
        status: ['active', 'exception', 'normal'][i % 3],
        percent: Math.ceil(Math.random() * 50) + 50,
        logo: avatars[i % 8],
        href: 'https://ant.design',
        updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
        subDescription: desc[i % 5],
        description:
          '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
        activeUser: Math.ceil(Math.random() * 100000) + 100000,
        newUser: Math.ceil(Math.random() * 1000) + 1000,
        star: Math.ceil(Math.random() * 100) + 100,
        like: Math.ceil(Math.random() * 100) + 100,
        message: Math.ceil(Math.random() * 10) + 10,
        content:
          '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
        members: [
          {
            avatar:
              'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
            name: '曲丽丽',
          },
          {
            avatar:
              'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
            name: '王昭君',
          },
          {
            avatar:
              'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
            name: '董娜娜',
          },
        ],
      });
    }

    return list;
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


  showModal(): void {
    this.isVisible = true;
  }
  mouseAction(name: string, e: any): void {
    console.log(name, e);
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

}
