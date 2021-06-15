import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Data, getTestData, EErrorCode, SectionData } from "../datas";
import { fromEvent as observableFromEvent, of as observableOf } from 'rxjs';
import { RpsBoardService, WorkShop } from '../rps-board.service';
import { Subscription } from 'rxjs/Subscription';
import { NzTableComponent } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { EfficiencyFormula } from "../datas";

@Component({
  selector: 'app-rps-table',
  templateUrl: './rps-table.component.html',
  styleUrls: ['./rps-table.component.less']
})
export class RpsTableComponent implements OnInit, OnDestroy {
  @Input()
  data: Data[] = getTestData() || [];
  showData: Data[] = []
  otherData: Data[] = []
  @Input() workShop: WorkShop;

  @Input()
  tableSize = 'small';//middle small
  @Input() changePageTime = 15;
  subscription: Subscription;
  subscription2: Subscription;
  subscriptionF: Subscription;
  @Input() key = 'SMT';
  testVis
  headData = {
    completeOk: 0,
    completeBad: 0,
    yieldOk: 0,
    yieldBad: 0
  }
  //定时器
  private nzTimer;
  newData = false;
  nzPageIndex = 1;
  nzPageSize = 5;
  nzTotal: Number;
  stopPage = false;
  isVisible = false;
  effData: EfficiencyFormula;

  @ViewChild('smallTable') smallTable: NzTableComponent;
  @ViewChild('divBox') divBox: ElementRef;
  progressColor = {
    'success': '#52c41a',
    'exception': '#f5222d',
    'active': '#c2af04',
    'none':'#ccc'
  }
  eErrorCode = EErrorCode;
  efficiency: number = 0;
  offlineEfficiency: number = 0;
  @Input() sectionData: SectionData;

  formatOne = (percent: number) => `${percent}%`;
  constructor(private rpsBoardService: RpsBoardService, private router: Router,) { }
  showDeatil(data: Data) {
    console.log('showDeatil', data,)

    this.effData = data.efficiencyFormula;
    if (!this.effData) return;
    this.effData.prolineCode = data.prolineCode;
    this.isVisible = true;

  }
  ngOnInit() {
    let i = 0;
    let effectiveOutput = 0;
    let signTime = 0;
    for (const iterator of this.data) {
      effectiveOutput += iterator.effectiveOutput;
      signTime += iterator.signTime;
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
      // if (iterator.isNull === '1') {
      //   const random = Math.floor(Math.random() * 2.2 );
      //   console.log('random', random)
      //   if (random === 1) {
      //     iterator.isNull = '1'
      //   } else  {
      //     iterator.isNull = '3'
      //   }
      // }
      // if (iterator.isNull === '0') {
      //   const random = Math.floor(Math.random() * 2.2 );
      //   console.log('random', random)
      //   if (random === 1) {
      //     iterator.isNull = '0'
      //   } else {
      //     iterator.isNull = '2'
      //   }
      // }
      // if (iterator.planNums === 0) {
      //   if (iterator.badNums + iterator.goodNums < 5) {
      //     iterator.isNull = '0';
      //   }
      // }
      iterator.completeStatus = this.getStatus('达成率', iterator.planAchievementRate);
      iterator.yieldStatus = this.getStatus('良率', iterator.yield);
      iterator.efficiencyStatus = this.getStatus('效率', iterator.efficiency);
      iterator.index = ++i;
    }
    setTimeout(() => {
      if (signTime) {
        this.efficiency = effectiveOutput / signTime;
        if (this.sectionData) {
          this.offlineEfficiency = (effectiveOutput + this.sectionData.stdSignOfflineTime) / signTime;
        }
        console.log('signTime', this.key, this.efficiency, this.offlineEfficiency, effectiveOutput, signTime)
      }
    }, 100);

    this.testVis = (this.key.includes('SMT'));

    this.getHeadData();
    this.initDatas();
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
    this.newData = true;
    this.changeSize()
    this.nzTimer = setInterval(() => {
      this.changePage(this.data, this.otherData, this.nzPageSize);
    }, this.rpsBoardService.changePageTime * 1000)

    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        this.changeSize();

      });
    this.changPageTime();

    this.subscriptionF = this.rpsBoardService.fullscreen$.subscribe(
      data => {
        setTimeout(() => {
          if (this.rpsBoardService.isFullscreen) {
            if (this.workShop.sort === 1) {
              this.changeSize()
            }
          } else {
            this.changeSize()
          }
        }, 10);
      }
    )
  }
  changeSize() {
    setTimeout(() => {
      const divHeight = this.divBox.nativeElement.clientHeight;
      const divWidth = this.divBox.nativeElement.clientWidth;

      const pagesize = divWidth > 480 ? Math.floor((divHeight - 64) / 40 + 0.02) : Math.floor((divHeight - 64) / 69 + 0.02)
      console.log('smallTable', this.key, pagesize, this.divBox.nativeElement.clientHeight)
      this.nzPageSize = pagesize;
      this.newData = true;
      this.initDatas();
      this.changePage(this.data, this.otherData, this.nzPageSize, true);
    }, 100);

  }
  initDatas() {
    this.otherData = [...this.data];
    this.showData = [];

  }

  changPageTime() {
    this.subscription = this.rpsBoardService.pageChangeTime$.subscribe(
      time => {
        if (this.nzTimer) {
          clearInterval(this.nzTimer);
        }
        this.newData = true;
        this.changePage(this.data, this.otherData, this.nzPageSize);
        this.nzTimer = setInterval(() => {
          this.changePage(this.data, this.otherData, this.nzPageSize);
          console.log('time', time)
        }, time * 1000)
      }
    )


  }
  /** 获取表头数据 */
  getHeadData() {
    this.headData = {
      completeOk: 0,
      completeBad: 0,
      yieldOk: 0,
      yieldBad: 0
    }
    this.nzTotal = this.data.length;
    for (const iterator of this.data) {
      if (iterator.isNull === '0' || iterator.isNull==='2') {
        // 无排产

        iterator.completeStatus='none';
        iterator.efficiencyStatus='none';
        iterator.yieldStatus='none';

        continue;
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
    console.log('showData', this.showData)
  }

  /** 获取状态 */
  getStatus(type: '良率' | '达成率' | '效率', value): 'success' | 'exception' | 'active' {
    if (type === '达成率') {
      if (value < this.rpsBoardService.standard.complete.bad) {
        // console.log('exception', value);
        return 'exception';
      }
      else if (value > this.rpsBoardService.standard.complete.good) {
        // console.log('success', value);

        return 'success'
      }
      else {
        // console.log('active', value);
        return 'active'
      }
    }
    else if (type === '良率') {
      if (value < this.rpsBoardService.standard.yield.bad) {
        return 'exception'
      }
      else if (value > this.rpsBoardService.standard.yield.good) {
        return 'success'
      }
      else return 'active'
    } else if (type === '效率') {
      if (value < this.rpsBoardService.standard.efficiency.bad) {
        return 'exception'
      }
      else if (value > this.rpsBoardService.standard.efficiency.good) {
        return 'success'
      }
      else return 'active'
    }

  }
  ngOnDestroy() {
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
    this.subscription.unsubscribe();
    this.subscriptionF.unsubscribe();
  }
  jump(data) {
    // f
    const { prolineCode } = data;
    const prolineType = this.key.includes('SMT') ? 'smt' : 'be'
    const urlend = `/fullscreen/dashboard/yieldDashboard?prolineCode=${prolineCode}&prolineType=${prolineType}`;
    const url = location.origin + urlend
    console.log('url', this.key, url, data)
    if (this.rpsBoardService.isFour) {
      window.open(url);

    } else {
      this.router.navigateByUrl(urlend)

      // window.history.back();
    }


  }


}
