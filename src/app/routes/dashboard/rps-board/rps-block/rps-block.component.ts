import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Data, getTestData, UrlData } from "../datas";
import { fromEvent as observableFromEvent, of as observableOf, Subscriber, Subscription } from 'rxjs';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { RpsBoardService, FactoryCode, WorkShop } from '../rps-board.service';
import { orderBy, slice, map, groupBy } from 'lodash';
import { groupByToJson, CallUserInfo, ErrorInfo, InitErrorData } from "../../utils";
import { DatePipe } from '@angular/common';
import { RpsTableComponent } from "../rps-table/rps-table.component";

interface BigData {
  title: string;
  data: Data[];
  key: string;
  isLoading?: boolean;
}

const options: {
  key: string,
  title: string,
  index: number[]
}[] = [
    {
      key: 'SMT',
      title: 'SMT',
      index: [0, 0]
    },
    {
      key: 'WAVE',
      title: 'WAVE',
      index: [0, 1]
    },

    {
      key: 'COATING',
      title: 'COATING',
      index: [1, 0]
    },
    {
      key: 'ATP',
      title: 'ATP',
      index: [1, 1]
    },
  ]
@Component({
  selector: 'app-rps-block',
  templateUrl: './rps-block.component.html',
  styleUrls: ['./rps-block.component.less']
})
export class RpsBlockComponent implements OnInit {
  @Input() isFourBlock = false;

  isError = false;
  errorIconSize = 60;
  isVisibleErrorDetail = false;
  currentErrorInfo: ErrorInfo
  leftSpan = 20
  @Input() workShop: WorkShop
  signSection?: {
    "WAVE"?: number,
    "shiftType"?: "白班" | "夜班",
    "COATING"?: number,
    "SMT"?: number,
    "ATP"?: number
  } = {};
  signSection2?: {
    "WAVE"?: number,
    "shiftType"?: "白班" | "夜班",
    "COATING"?: number,
    "SMT"?: number,
    "ATP"?: number
  } = {};
  signSection3?: {
    "WAVE"?: number,
    "shiftType"?: "白班" | "夜班",
    "COATING"?: number,
    "SMT"?: number,
    "ATP"?: number
  } = {};

  allData: BigData[][] = [];
  topData: BigData[] = [];
  bottomData: BigData[] = [];
  fontSizeTitle1 = 42;//一级标题
  fontSizeTitle2 = 24;//二级标题
  tableSize: 'middle' | 'small' = 'middle';
  rightShow: ErrorInfo[] = [];
  rightOther: ErrorInfo[] = [];
  rightData: ErrorInfo[] = []

  private dataTimer;
  private errorTimer;
  private rightTimer;
  countTimeTimer;


  @ViewChild('errorBox') errorBox: ElementRef;


  @ViewChild('errodHead') errodHead: ElementRef;
  @ViewChild('tableATP') tableATP: RpsTableComponent;
  @ViewChild('tableSMT') tableSMT: RpsTableComponent;

  @ViewChild('tableWAVE') tableWAVE: RpsTableComponent;

  @ViewChild('tableCOATING') tableCOATING: RpsTableComponent;




  constructor(private http: HttpService, private route: ActivatedRoute, private datePipe: DatePipe, private pageService: PageService, public rpsBoardService: RpsBoardService) {

  }
  subscription: Subscription;
  subscriptionF: Subscription;

  countTime = Date.now() + 1000
  nowTime = new Date();

  ngOnInit() {
    // const timer=Timer(Date.now,true)

    console.log('window.screen.height', window.screen.width, window.screen.height)
    if (window.screen.height <= 900) {
      this.fontSizeTitle1 = 32;//一级标题
      this.fontSizeTitle2 = 18;//二级标题
      this.tableSize = "small";
    }
    this.autoSize();

    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
    if (this.errorTimer) {
      clearInterval(this.errorTimer);
    }
    if (this.rightTimer) {
      clearInterval(this.rightTimer);
    }

    this.initData();
    this.getAllData();
    this.getErrorData()

    this.dataTimer = setInterval(() => {
      this.getAllData();
    }, 5 * 60 * 1000)

    this.errorTimer = setInterval(() => {
      this.getErrorData();
    }, 60 * 1000)

    this.rightTimer = setInterval(() => {
      this.changePage(this.rightData, this.nzPageSize);
    }, 15 * 1000)

    this.subscription = this.rpsBoardService.changeWorkShop$.subscribe(data => {
      console.log('changeData', data.newObj)

      if (data.obj.sort === this.workShop.sort || data.newObj.workShopCode === '-1') {
        this.changeData(data.newObj)
      }else{
        this.getErrorData();
      }
    })

    this.subscriptionF = this.rpsBoardService.fullscreen$.subscribe(
      data => {
        console.log('subscriptionF', data, this.workShop.workShopCode, this.workShop)

        setTimeout(() => {
          this.changeSize()
        }, 100);
      }
    )



  }
  // 1000 * 60 * 60 * 24 * 2 + 1000 * 30;

  changeData(newWorkShop: WorkShop) {
    if (newWorkShop.workShopCode !== '-1') {
      this.workShop.workShopCode = newWorkShop.workShopCode;
    }
    for (const lineData of this.allData) {

      for (const onedata of lineData) {
        onedata.isLoading = true;
      }
    }
    this.getAllData();
    this.getErrorData();
  }

  getErrorData() {
    // if (this.rpsBoardService.date) {
    //   this.isError = false
    //   this.rpsBoardService.clearAll(this.rightData, this.rightShow, this.rightOther)
    //   return;
    // }
    let factoryCode = FactoryCode[this.workShop.workShopCode];
    if (!factoryCode) factoryCode = this.workShop.workShopCode;
    if (factoryCode === '-1') factoryCode = '';
    console.log('getAbnormalInfo do', factoryCode)
    // this.http.getHttpAllUrl('http://172.16.8.28:8088/api/getAbnormalInfo?LineCode=SUZ15BE-1').subscribe(
    //   data=>{
    //     console.log('getErrorData SUZ15BE-1', data)
    //   }
    // )
    let url = 'http://172.16.8.28:8088/api/getAbnormalInfo';
    const body = { FactoryCode: factoryCode }
    if (this.rpsBoardService.date && this.rpsBoardService.dateMode) {
      url += `/GetAbnormalByDate`;
      body['FDate'] = this.rpsBoardService.date;
    }
    console.log('getErrorData', url, body)
    this.http.postHttpAllUrl(url, body).subscribe(
      (data: {
        data: { CallInfo: ErrorInfo[], CallUserInfo: CallUserInfo[], ErrorCode: number, Msg?: string }
      }) => {
        console.log('getErrorData', data)
        if (data.data.ErrorCode === 0) {
          this.rightData = data.data.CallInfo;
          // console.log('getErrorData', data.data.CallInfo)

          this.isError = InitErrorData(this.rightData, data.data.CallUserInfo)
          console.log('errorData', this.rightData)
          this.changeSize()
        } else {
          this.isError = false
          this.rpsBoardService.clearAll(this.rightData, this.rightShow, this.rightOther)
          console.log('getErrorData', data.data.Msg, this.rightData, this.rightShow, this.rightOther)

        }


      }
    )

  }
  visible(event, item, index) {
    this.rpsBoardService.visible(event, item, index, this.rightShow, this.rightOther)

  }
  changeSize() {
    const errorListHeight = this.errorBox.nativeElement.clientHeight - this.errodHead.nativeElement.clientHeight
    console.log('errorBox', this.errorBox.nativeElement.clientHeight, this.errodHead.nativeElement.clientHeight, errorListHeight)

    const pagesize = Math.floor(errorListHeight / (210 + 5) + 0.05)
    this.nzPageSize = pagesize;
    console.log('changeSize', this.nzPageSize, this.workShop, this.allData)
    this.changePage(this.rightData, this.nzPageSize, true);
  }
  initDatas() {
    this.rightOther = [...this.rightData];
    this.rightShow = [];

  }

  async changePage(allData: ErrorInfo[], size: number, init: boolean = false) {

    if (init) {
      this.initDatas()
    }

    let rightShow: ErrorInfo[] = []
    if (allData.length === 0) {
      return;
    }

    if (size >= allData.length) {
      rightShow = [...allData];
      this.rightShow = rightShow;
      return;
    }

    const ToRight: ErrorInfo[] = []
    for (const iterator of this.rightShow) {
      ToRight.push(iterator)
    }
    let addNumber = 0;
    for (const iterator of this.rightOther) {
      rightShow.push(iterator);
      addNumber++;
      if (addNumber === size) {
        break;
      }
    }
    this.rightOther.splice(0, size);
    // ToRight.sort((a, b) => a.index - b.index);

    for (const iterator of ToRight) {
      this.rightOther.push(iterator);
    }
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    //  TODO 残缺补全
    // }
    this.rightShow = rightShow;
    // this.rightShow.sort((a, b) => a.sort - b.sort);
  }
  initData() {
    console.log('getAllData')
    this.topData = [];
    this.bottomData = [];
    this.allData = [];
    this.topData.push({
      title: 'SMT',
      data: getTestData(),
      key: 'SMT',
      isLoading: true
    })
    this.topData.push({
      title: 'WAVE',
      data: getTestData(),
      key: 'WAVE',
      isLoading: true
    })

    this.bottomData.push({
      title: 'COATING',
      data: getTestData(),
      key: 'COATING',
      isLoading: true
      // data:[]
    })
    this.bottomData.push({
      title: 'ATP',
      data: getTestData(),
      key: 'ATP',
      isLoading: true
    })
    this.allData.push(this.topData);
    this.allData.push(this.bottomData);
    // setTimeout(() => {
    //   // 模拟数据
    //   for (const iterator of this.allData) {
    //     for (const data of iterator) {
    //       data.isLoading = false;
    //     }
    //   }
    // }, 1);
  }
  jump() {
    // f
    const url = location.origin + `/fullscreen/dashboard/rpsboard/v1?workshopCode=` + this.workShop.workShopCode
    window.open(url);

  }
  fullscreen() {
    // this.router.navigate([this.loginUrl]
    this.jump()
    return;
    // this.rpsBoardService.isFullscreen = !this.rpsBoardService.isFullscreen
    // if (this.rpsBoardService.isFullscreen) {
    //   this.workShop.oldSort = this.workShop.sort;
    //   this.workShop.sort = 1
    // } else {

    //   for (const key in this.rpsBoardService.fourBlock) {
    //     if (Object.prototype.hasOwnProperty.call(this.rpsBoardService.fourBlock, key)) {
    //       const element = this.rpsBoardService.fourBlock[key];
    //       if (element.oldSort) this.workShop.sort = element.oldSort;
    //       delete element.oldSort;
    //     }
    //   }
    // }
    // this.rpsBoardService.fullscreen$.next(this.rpsBoardService.isFullscreen);
  }
  totalData = {
    onlineSign: 0,
    kaoqin: 0,
    signTime: 0,
    effectiveOutput: 0,
    onlineEfficiency: 0
  }
  getTotalData(mainData = false) {
    return;
    const type = ['WAVE', 'COATING', 'SMT', 'ATP']

    let onlineSign = 0;
    for (const key in this.signSection) {
      if (Object.prototype.hasOwnProperty.call(this.signSection, key)) {
        if (type.includes(key) && this.signSection[key]) {
          onlineSign += this.signSection[key]
        }
      }
    }
    this.totalData.onlineSign = onlineSign;

    let kaoqin = 0;
    for (const key in this.signSection2) {
      if (Object.prototype.hasOwnProperty.call(this.signSection2, key)) {
        if (type.includes(key) && this.signSection2[key]) {
          kaoqin += this.signSection2[key]
        }
      }
    }
    this.totalData.kaoqin = kaoqin;

    if (mainData) {
      // 签到工时
      let signTime = 0;
      /** 生产工时 */
      let effectiveOutput = 0;
      /** 在线总效率 */
      try {
        for (const oneDatas of this.allData) {
          for (const bigData of oneDatas) {
            for (const iterator of bigData.data) {
              effectiveOutput += iterator.effectiveOutput;
              signTime += iterator.signTime;
            }
          }
        }
      } catch (error) { }

      if (signTime) {
        this.totalData.onlineEfficiency = effectiveOutput / signTime;
      }
      this.totalData.effectiveOutput = effectiveOutput;
      this.totalData.signTime = signTime;

    }


  }
  getAllData(errorCount = 0) {
    if (errorCount >= 3) return;
    let url = "/yieldDashboard/worksectionData/" + this.workShop.workShopCode;
    if (this.rpsBoardService.date && this.rpsBoardService.dateMode) {
      url += `/${this.rpsBoardService.dateMode}/${this.rpsBoardService.date}`
    }
    // this.http.getHttpAllUrl("http://172.18.3.202:8080/yieldDashboard/worksectionData/" + this.workShop.workShopCode).subscribe((data: UrlData) => {
    this.signSection = {};
    this.signSection2 = {};
    this.signSection3 = {};



    this.http.getHttp(url).subscribe((data: UrlData) => {
      this.signSection = data.data.signSection || {};

      this.http.postHttpAllUrl('http://172.16.8.28:8088/api/getkp', {
        "FDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "FShift": this.signSection.shiftType === '白班' ? "DayShift" : 'NightShift',
        "FactoryCode": this.workShop.workShopCode,
        "Fkind": "0"
      }).subscribe((data: any) => {
        console.log('getkp0', data)
        if (data.data && data.data.length) {
          for (const iterator of data.data) {
            this.signSection2[iterator['WORK_SHOP_CODE']] = iterator['HeadCount']
          }
        }
        this.getTotalData();
      })
      this.http.postHttpAllUrl('http://172.16.8.28:8088/api/getkp', {
        "FDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        "FShift": this.signSection.shiftType === '白班' ? "DayShift" : 'NightShift',
        "FactoryCode": this.workShop.workShopCode,
        "Fkind": "1"
      }).subscribe((data: any) => {
        console.log('getkp1', data)
        if (data.data && data.data.length) {
          for (const iterator of data.data) {
            this.signSection3[iterator['WORK_SHOP_CODE']] = iterator['HeadCount']
          }
        }
      })

      for (const option of options) {
        console.log('data', option.key, data);
        const dataList = data.data[option.key];
        if (dataList) {
          this.allData[option.index[0]][option.index[1]].isLoading = true;
          this.allData[option.index[0]][option.index[1]].data = dataList
          this.allData[option.index[0]][option.index[1]].title = option.title;
          setTimeout(() => {
            // 模拟数据
            if (dataList.length > 0)
              this.allData[option.index[0]][option.index[1]].isLoading = false;
            else {
              // TODO 无数据
              this.allData[option.index[0]][option.index[1]].isLoading = false;
            }
          }, 1);
        } else {
          this.allData[option.index[0]][option.index[1]].data = [];
          this.allData[option.index[0]][option.index[1]].title = option.title;
          this.allData[option.index[0]][option.index[1]].isLoading = false;

        }
      }
      if (data.data.planAchievementRate) {
        this.rpsBoardService.standard.complete = data.data.planAchievementRate
      }
      if (data.data.yield) {
        this.rpsBoardService.standard.yield = data.data.yield
      }
      if (data.data.efficiency) {
        this.rpsBoardService.standard.efficiency = data.data.efficiency
      }

      this.getTotalData(true);

    },
      error => {
        console.error('getAllData', this.workShop.workShopCode)
        this.getAllData(errorCount + 1);
      })
    // SMT





  }
  lastHeight = window.innerHeight;
  nzPageSize = 1;

  autoSize() {
    observableFromEvent(window, 'resize')
      .subscribe((event) => {

        // 163;
        // 操作
        // if (window.innerHeight >= 900)
        // 
        if (window.innerHeight <= 900) {
          this.fontSizeTitle1 = 32;//一级标题
          this.fontSizeTitle2 = 18;//二级标题
          this.tableSize = "small";
        } else {
          this.fontSizeTitle1 = 42;//一级标题
          this.fontSizeTitle2 = 24;//二级标题
          this.tableSize = 'middle';
        }

        if (window.innerHeight > 2000) {
          this.errorIconSize = 100;
        } else {
          this.errorIconSize = 60;
        }
        setTimeout(() => {
          this.changeSize()
        }, 10);
        if (this.lastHeight) this.lastHeight = window.innerHeight;

      });
  }
  isVisible = false;
  change(workShop: WorkShop) {
    if (this.workShop.workShopCode === workShop.workShopCode) return;

    this.changeData(workShop)
    this.isVisible = false;
    // TODO
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionF.unsubscribe();
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
    if (this.errorTimer) {
      clearInterval(this.errorTimer);
    }
    if (this.rightTimer) {
      clearInterval(this.rightTimer);
    }
  }

  showErrorDetail(errorInfo: ErrorInfo) {
    this.currentErrorInfo = errorInfo;
    this.isVisibleErrorDetail = true;
  }
}


// A0101: "牛连胜"
// FBillNo: "C2104011254550007"
// FDate: "2021-04-01 12:54:55"
// FUserCode: "2009005   "

// FBillNo": 呼叫编号
// FLocation": 呼叫位置
// FReason": 呼叫原因
// FCallDate": 呼叫日期
// FCallUser": 呼叫人工号
// FCallUserName": 呼叫人姓名
// FRespUser": 响应人工号
// FRespUserName": 响应人姓名
// FMaintUserCode": 维修人工号
// FMaintUserName": 维修人姓名
// FRespDate": 响应时间间隔
// FMaintDate": 维修时间
// FStopLineDate": 累计停线时间
// FactoryCode": 工厂代码
// FState": 状态
// CallUserInfo 被呼叫人信息
// FBillNo: 呼叫编号
// FUserCode: 工号,
// A0101: 姓名,
// FDate: 呼叫时间
// {
//   "FBillNo": "C210323222703",
//   "FLocation": "SUZ21SMT-A",
//   "FReason": "XP异常中",
//   "FCallDate": "2021-03-23 22:27:03",
//   "FCallUser": "2011024",
//   "FCallUserName": "绪立成",
//   "FRespUser": "",
//   "FRespUserName": "",
//   "FMaintUserCode": "2011024",
//   "FMaintUserName": "绪立成",
//   "FRespDate": 3936,
//   "FMaintDate": 5754,
//   "FStopLineDate": 8002,
//   "FactoryCode": "SUZ01",
//   "FState": "已维修"
// }