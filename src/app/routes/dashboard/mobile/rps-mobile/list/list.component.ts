import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Data, getTestData } from "../../../rps-board/datas";
import { fromEvent as observableFromEvent, of as observableOf } from 'rxjs';
import { RpsBoardService } from '../../../rps-board/rps-board.service';
import { Subscription } from 'rxjs/Subscription';
import { NzTableComponent } from 'ng-zorro-antd';
import { RpsMobileService } from "../rps-mobile.service";
import { ActionSheetService, ToastService } from 'ng-zorro-antd-mobile';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit, OnDestroy {
  @Input()
  datas: Data[] = getTestData() || [];
  showData: Data[] = []
  otherData: Data[] = []
  @Input()
  tableSize = 'small';//middle small
  @Input() changePageTime = 15;
  subscription: Subscription;
  @Input()
  standard = {
    complete: {
      good: 95,
      bad: 75
    },
    yield: {
      good: 90,
      bad: 85
    }
  }
  @Input() key = 'SMT';
  testVis
  headData = {
    completeOk: 0,
    completeBad: 0,
    yieldOk: 0,
    yieldBad: 0,
    ok: 0,
    bad: 0,
    isNull: 0
  }
  //定时器
  private nzTimer;
  newData = false;
  nzPageIndex = 1;
  nzPageSize = 5;
  nzTotal: Number;
  stopPage = false;

  @ViewChild('smallTable') smallTable: NzTableComponent;
  @ViewChild('divBox') divBox: ElementRef;


  constructor(private rpsBoardService: RpsBoardService, public rpsMobileService: RpsMobileService, private _actionSheet: ActionSheetService,) { }

  ngOnInit() {
    console.log('mobile', this.datas)

    let i = 0;
    for (const iterator of this.datas) {
      // 模拟数据
      // const randomNum = Math.floor(Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);
      // iterator.planAchievementRate = iterator.planAchievementRate + randomNum;
      // if (iterator.planAchievementRate > 100) iterator.planAchievementRate = 100;
      // iterator.yield = iterator.yield + randomNum;
      // if (iterator.yield > 100) iterator.yield = 99;
      // 获取状态
      // iterator.planAchievementRate = iterator.planAchievementRate * 100;
      // iterator.yield = iterator.yield * 100;
      if (!iterator.isNull) iterator.isNull = '1';
      // if (iterator.planNums === 0) {
      //   if (iterator.badNums + iterator.goodNums < 5) {
      //     iterator.isNull = '0';
      //   }
      // }
      iterator.completeStatus = this.getStatus('达成率', iterator.planAchievementRate);
      iterator.yieldStatus = this.getStatus('良率', iterator.yield);
      iterator.index = ++i;
    }
    this.testVis = (this.key.includes('SMT'));

    this.getHeadData();
    this.initDatas();

    this.newData = true;

  }
  changeSize() {
    const divHeight = this.divBox.nativeElement.clientHeight;
    const pagesize = Math.floor((divHeight - 50) / 64 + 0.2)
    this.nzPageSize = pagesize;
    this.newData = true;
    console.log('smallTable', this.key, pagesize, this.divBox.nativeElement.clientHeight)
    this.initDatas();
    this.changePage(this.datas, this.otherData, this.nzPageSize, true);
  }
  initDatas() {
    this.otherData = [...this.datas];
    this.showData = [...this.datas];
  }


  /** 获取表头数据 */
  getHeadData() {
    this.headData = {
      completeOk: 0,
      completeBad: 0,
      yieldOk: 0,
      yieldBad: 0,
      ok: 0,
      bad: 0,
      isNull: 0
    }
    this.nzTotal = this.datas.length;
    for (const iterator of this.datas) {
      if (iterator.isNull === '0') {
        this.headData.isNull++;
        continue;
      }
      if (iterator.completeStatus === 'success' && iterator.yieldStatus === 'success') {
        this.headData.ok++;
      } else {
        this.headData.bad++;
      }
      if (iterator.completeStatus === 'success') {
        this.headData.completeOk++;
      } else {
        this.headData.completeBad++;
      }
      if (iterator.yieldStatus === 'success') {
        this.headData.yieldOk++;
      } else {
        this.headData.yieldBad++;
      }
    }
  }
  /** 轮播 */
  async changePage(allData: Data[], otherData: Data[], size: number, force: boolean = false) {
    if (!force) {
      if (this.stopPage && this.showData.length > 0) return;
    }

    if (allData.length === 0) {
      return;
    }
    if (size >= allData.length) {
      this.showData = [...allData];
      return;
    }
    console.log('do', this.key)
    const ToRight = []
    for (const iterator of this.showData) {
      ToRight.push(iterator)
    }
    this.showData.splice(0, this.showData.length)
    let addNumber = 0;
    for (const iterator of otherData) {
      this.showData.push(iterator);
      addNumber++;
      if (addNumber === size) {
        break;
      }
    }
    otherData.splice(0, size);
    for (const iterator of ToRight) {
      otherData.push(iterator);
    }
    this.showData = [...this.showData]
  }

  /** 获取状态 */
  getStatus(type: '良率' | '达成率', value): 'success' | 'exception' | 'active' {
    if (type === '达成率') {
      if (value < this.standard.complete.bad) {
        // console.log('exception', value);
        return 'exception';
      }
      else if (value > this.standard.complete.good) {
        // console.log('success', value);

        return 'success'
      }
      else {
        // console.log('active', value);
        return 'active'
      }
    }
    else if (type === '良率') {
      if (value < this.standard.yield.bad) {
        return 'exception'
      }
      else if (value > this.standard.yield.good) {
        return 'success'
      }
      else return 'active'
    }

  }
  ngOnDestroy() {
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
    // this.subscription.unsubscribe();
  }
  jump(data) {
    // f
    const { prolineCode } = data;
    const prolineType = this.key.includes('SMT') ? 'smt' : 'be'
    const url = location.origin + `/fullscreen/dashboard/yieldDashboard?prolineCode=${prolineCode}&prolineType=${prolineType}`;
    console.log('url', this.key, url, data)

    window.open(url);

  }
  onClick() {

  }
  changeType(event: { selectedIndex: number, value: '全部' | '未达标' | '达标' | '无排产' }) {
    console.log(event)
    switch (event.selectedIndex) {
      case 0:
        this.showData = [...this.datas]
        break;
      case 1:
        this.showData = this.datas.filter(a => {
          return (a.completeStatus !== 'success' || a.yieldStatus !== 'success') && a.isNull !== '0'
        });
        break;
      case 2:
        this.showData = this.datas.filter(a => {
          return (a.completeStatus === 'success' && a.yieldStatus === 'success') && a.isNull !== '0'
        });
        break;
      case 3:
        this.showData = this.datas.filter(a => {
          return a.isNull === '0'
        });
        break;

      default:
        break;
    }
    // this.showData = this.datas.filter(a=>{
    //   return a.
    // });

  }
  // visible(event, item, index) {
  //   console.log('visible', index+1, event.visible,item)

  //   this.rpsBoardService.visible(event, item, index, this.showData, this.otherData)
  // }
  // pageChangeInit(reset = true) {
  //   console.log('pageChangeInit')
  //   this.rpsBoardService.pageChangeInit(this.datas, this.otherData, reset)
  // }
  // pageChange() {
  //   this.rpsBoardService.changePage(this.datas, this.otherData);
  // }

  initData: Array<any>;
  show: boolean = false;
  menuHeight: number = document.documentElement.clientHeight * 0.6;
  data: Array<any> = [

    {
      value: 'SUZ15-1F',
      label: 'SUZ15-1F'
    },
    {
      value: '-1',
      label: '全厂',
      isLeaf: true
    }
  ];

  onChange(value) {
    console.log(value);
    this.show = false;
    this.rpsMobileService.workshopCode = value[0];
    this.rpsMobileService.changeWorkshop$.next(value[0])
  }

  handleClick(e) {
    e.preventDefault();
    this.show = !this.show;
    if (!this.initData) {
      setTimeout(() => {
        this.data = [
          {
            value: '-1',
            label: '全厂'
          }
        ]
        for (const iterator of this.rpsBoardService.workshops) {
          this.data.push({
            value: iterator.workShopCode,
            label: iterator.workShopCode
          })
        }
        this.initData = this.data;

      }, 500);
    }
  }

  onMaskClick() {
    this.show = false;
  }

}
