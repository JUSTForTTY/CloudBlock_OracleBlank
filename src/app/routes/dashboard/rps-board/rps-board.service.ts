import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '@delon/theme';

export const FactoryCode = {
  'SUZ15-1F': 'SUZ01',
  'SX-P1': 'SX-P1',
  'SUZ21-2F': 'SUZ02',
  'SX-P2': 'SX-P2',
  'SUZ15-2F': 'SUZ03',
  'SX-P3': 'SX-P3',
  'SUZ21-1F': 'SUZ04',
  'SX-P6': 'SX-P6',
}
export interface WorkShop {
  createTime?: string
  createUser?: string
  factoryCode?: string
  factorySn?: string
  flag?: string
  markDate?: string
  markTime?: string
  modifyTime?: string
  modifyUser?: string
  remark?: string
  workShopCode?: string
  workShopCodeDes?: string
  workShopSn?: string;
  isAdding?: boolean;
  sort?: number;
  oldSort?: number;

}
export interface BlockData {
  [key: string]: WorkShop
}
interface Data { index?: number, [key: string]: any }
@Injectable()
export class RpsBoardService {
  isFour = false;
  isFullscreen = false;
  changePageTime = 15;
  date = ''
  dateMode: 'NightShift' | 'DayShift' | '' = ''
  pageChangeTime$: Subject<number> = new Subject();
  fullscreen$: Subject<boolean> = new Subject();
  changeWorkShop$: Subject<{ obj: WorkShop, newObj: WorkShop, force?: boolean }> = new Subject();

  standard = {
    complete: {
      good: 95,
      bad: 75
    },
    yield: {
      good: 90,
      bad: 85
    },
    efficiency:{
      good: 90,
      bad: 85
    }
  }
  fourBlock: BlockData = {
    'SUZ01': {
      workShopCode: 'SUZ15-1F',
      isAdding: false,
      sort: 2
    },
    'SUZ02': {
      workShopCode: 'SUZ21-2F',
      isAdding: false,
      sort: 3
    },
    'SUZ03': {
      workShopCode: 'SUZ15-2F',
      isAdding: false,
      sort: 4
    },
    'SUZ04': {
      workShopCode: 'SUZ21-1F',
      isAdding: false,
      sort: 5
    }
  }
  workshops: WorkShop[] = []

  adData = {
    pageAvg: true
  }

  constructor(private pageService: PageService, private http: HttpService, private titleSrv: TitleService) {
    // 获取工厂列表
    http.postHttp('/workshop/condition').subscribe(data => {
      console.log('workshop,', data);
      this.workshops = data.data
    })
  }
  clearAll(allData: Data[], showData: Data[], otherData: Data[]) {
    showData.splice(0, showData.length)
    otherData.splice(0, otherData.length)
    allData.splice(0, allData.length)
  }

  visible(event, item: Data, index, showData: Data[], otherData: Data[]) {
    // console.log('visible', item.index, event.visible)
    if (!event.visible) {
      let addIndx = 0;
      for (const iterator of otherData) {
        if (iterator.index > item.index) {
          break;
        }
        addIndx++;
      }
      otherData.splice(addIndx, 0, item);
      showData.splice(index, 1);
    }
  }

  getRouteParam(route: ActivatedRoute, DefaultTitle = '看板'): WorkShop {
    console.log('getRouteParam workshopCode')
    let path = this.pageService.getPathByRoute(route);
    //监听路径参数
    this.pageService.setRouteParamsByRoute(route, path);
    //初始化参数识别字串
    let queryParamStr = '';
    for (const key in this.pageService.routeParams[path]) {
      if (this.pageService.routeParams[path].hasOwnProperty(key)) {
        queryParamStr = queryParamStr + this.pageService.routeParams[path][key];
      }
    }
    //  path 可不传
    //  this.activatedRoute 需保证准确
    let workshopCode = this.pageService.getRouteParams(route, 'workshopCode', path);
    if (!workshopCode) workshopCode = '-1';
    if (workshopCode === '-1') {
      this.isFour = true;
      this.titleSrv.setTitle('全厂' + DefaultTitle)
    } else {
      this.isFour = false;
      this.titleSrv.setTitle(workshopCode + DefaultTitle)

    }
    console.log('workshopCode,shiftTypeCode', workshopCode, this.isFour);
    return {
      workShopCode: workshopCode,
      isAdding: false,
      sort: 1
    }
  }



}
