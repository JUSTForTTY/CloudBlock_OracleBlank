
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SettingsService } from '@delon/theme';
import { UserService } from './../../core/service/user.service';

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [

];
const radarData = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

@Component({
  selector: 'app-dashboard-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.less']
})

export class DashboardWorkplaceComponent implements OnInit, OnDestroy {
  userName = "匿名";
  notice: any[] = [];
  activities: any[] = [];
  radarData: any[] = [];
  loading = true;
  array = [

  ];

  // region: mock data
  links = [
    {
      title: '操作一',
      href: '',
    },
    {
      title: '操作二',
      href: '',
    },
    {
      title: '操作三',
      href: '',
    },
    {
      title: '操作四',
      href: '',
    },
    {
      title: '操作五',
      href: '',
    },
    {
      title: '操作六',
      href: '',
    },
  ];
  members = [
  ];
  // endregion

  constructor(private http: _HttpClient, public settings: SettingsService, public msg: NzMessageService, public userService: UserService) { }


  ngOnInit() {

    if (this.userService.getCurrentUser() != null) {
      console.log("用户信息", this.userService.getCurrentUser())
      this.userName = this.userService.getCurrentUser()['csysUserRealname'];
    }

    radarOriginData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'name') {
          radarData.push({
            name: item.name,
            label: radarTitleMap[key],
            value: item[key],
          });
        }
      });
    });
    this.radarData = radarData;
    this.notice = [
      {
        id: 'xxx1',
        title: titles[0],
        logo: avatars[0],
        description: '那是一种内在的东西， 他们到达不了，也无法触及的',
        updatedAt: new Date(),
        member: '科学搬砖组',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx2',
        title: titles[1],
        logo: avatars[1],
        description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
        updatedAt: new Date('2017-07-24'),
        member: '全组都是吴彦祖',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx3',
        title: titles[2],
        logo: avatars[2],
        description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        updatedAt: new Date(),
        member: '中二少女团',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx4',
        title: titles[3],
        logo: avatars[3],
        description: '那时候我只会想自己想要什么，从不想自己拥有什么',
        updatedAt: new Date('2017-07-23'),
        member: '程序员日常',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx5',
        title: titles[4],
        logo: avatars[4],
        description: '凛冬将至',
        updatedAt: new Date('2017-07-23'),
        member: '高逼格设计天团',
        href: '',
        memberLink: '',
      },
      {
        id: 'xxx6',
        title: titles[5],
        logo: avatars[5],
        description: '生命就像一盒巧克力，结果往往出人意料',
        updatedAt: new Date('2017-07-23'),
        member: '骗你来学计算机',
        href: '',
        memberLink: '',
      },
    ];
    this.activities = [
      {
        id: 'trend-1',
        updatedAt: new Date(),
        user: {
          name: '林东东',
          avatar: avatars[0],
        },
        group: {
          name: '高逼格设计天团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-2',
        updatedAt: new Date(),
        user: {
          name: '付小小',
          avatar: avatars[1],
        },
        group: {
          name: '高逼格设计天团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-3',
        updatedAt: new Date(),
        user: {
          name: '曲丽丽',
          avatar: avatars[2],
        },
        group: {
          name: '中二少女团',
          link: 'http://github.com/',
        },
        project: {
          name: '六月迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
      {
        id: 'trend-4',
        updatedAt: new Date(),
        user: {
          name: '周星星',
          avatar: avatars[3],
        },
        project: {
          name: '5 月日常迭代',
          link: 'http://github.com/',
        },
        template: '将 @{project} 更新至已发布状态',
      },
      {
        id: 'trend-5',
        updatedAt: new Date(),
        user: {
          name: '朱偏右',
          avatar: avatars[4],
        },
        project: {
          name: '工程效能',
          link: 'http://github.com/',
        },
        comment: {
          name: '留言',
          link: 'http://github.com/',
        },
        template: '在 @{project} 发布了 @{comment}',
      },
      {
        id: 'trend-6',
        updatedAt: new Date(),
        user: {
          name: '乐哥',
          avatar: avatars[5],
        },
        group: {
          name: '程序员日常',
          link: 'http://github.com/',
        },
        project: {
          name: '品牌迭代',
          link: 'http://github.com/',
        },
        template: '在 @{group} 新建项目 @{project}',
      },
    ];
    this.loading = false;
  }

  ngOnDestroy(): void {
  }
}
