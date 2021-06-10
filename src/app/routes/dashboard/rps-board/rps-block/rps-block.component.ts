import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Data, getTestData, UrlData, SignSection, WorkType, EfficiencyFormulaProd } from "../datas";
import { fromEvent as observableFromEvent, of as observableOf, Subscriber, Subscription } from 'rxjs';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { RpsBoardService, FactoryCode, WorkShop, TotalData } from '../rps-board.service';
import { orderBy, slice, map, groupBy } from 'lodash';
import { groupByToJson, CallUserInfo, ErrorInfo, InitErrorData } from "../../utils";
import { DatePipe } from '@angular/common';
import { RpsTableComponent } from "../rps-table/rps-table.component";
import { addDays } from 'date-fns';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';

interface BigData {
  title: string;
  data: Data[];
  key: string;
  isLoading?: boolean;
  height?: number;
  headHeight?: number;
  efficiency?: number;
  offlineEfficiency?: number;
  totalData?: TotalData
}

const options: {
  key: string,
  title: string,
  index: number[],
  height: number,
}[] = [
    {
      key: 'SMT',
      title: 'SMT',
      index: [0, 0],
      height: 100
    },
    {
      key: 'WAVE',
      title: 'WAVE',
      index: [1, 0],
      height: 50
    },

    {
      key: 'COATING',
      title: 'COATING',
      index: [1, 1],
      height: 50
    },
    {
      key: 'ATP',
      title: 'ATP',
      index: [2, 0],
      height: 50
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
  signSection?: SignSection = {
    "WAVE": {
      kaoqin: 0,
      paiban: 0,
      signCountAll: 0
    },
    "COATING": {
      kaoqin: 0,
      paiban: 0,
      signCountAll: 0
    },
    "SMT": {
      kaoqin: 0,
      paiban: 0,
      signCountAll: 0
    },
    "ATP": {
      kaoqin: 0,
      paiban: 0,
      signCountAll: 0
    },
  };

  allData: BigData[][] = [];
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
  isAllLoading = false;


  @ViewChild('errorBox') errorBox: ElementRef;


  @ViewChild('errodHead') errodHead: ElementRef;
  // @ViewChild('tableATP') tableATP: RpsTableComponent;
  // @ViewChild('tableSMT') tableSMT: RpsTableComponent;

  // @ViewChild('tableWAVE') tableWAVE: RpsTableComponent;

  // @ViewChild('tableCOATING') tableCOATING: RpsTableComponent;




  constructor(private http: HttpService,
    private msg: NzMessageService,
    private route: ActivatedRoute, private datePipe: DatePipe, private pageService: PageService, public rpsBoardService: RpsBoardService) {

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
      } else {
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
    this.allData = [];

    this.allData.push([{
      title: 'SMT',
      data: getTestData(),
      key: 'SMT',
      isLoading: true,
      height: 100,
      headHeight: 9.5
    }]);
    this.allData.push([{
      title: 'WAVE',
      data: getTestData(),
      key: 'WAVE',
      isLoading: true,
      height: 50,
      headHeight: 19.5
    }, {
      title: 'COATING',
      data: getTestData(),
      key: 'COATING',
      isLoading: true,
      height: 50,
      headHeight: 19.5
      // data:[]
    }]);

    this.allData.push([{
      title: 'ATP',
      data: getTestData(),
      key: 'ATP',
      isLoading: true,
      height: 100,
      headHeight: 9.5
    }]);
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
  totalData: TotalData = {
    onlineSign: 0,
    kaoqin: 0,
    signTime: 0,
    effectiveOutput: 0,
    onlineEfficiency: 0,
    offlineEfficiency: 0,
    stdSignOfflineTime: 0,
    signCountOffline: 0,
    paiban: 0
  }

  getTotalData(mainData = false) {
    const type = ['WAVE', 'COATING', 'SMT', 'ATP']

    let onlineSign = 0;
    let kaoqin = 0;
    let stdSignOfflineTime = 0;
    let signCountOffline = 0;
    for (const key in this.signSection) {
      if (Object.prototype.hasOwnProperty.call(this.signSection, key)) {
        if (type.includes(key) && this.signSection[key]) {
          const data = this.signSection[key as WorkType]
          onlineSign += data.signCountAll
          signCountOffline += data.signCountOffline;
          stdSignOfflineTime += data.stdSignOfflineTime;
          if (data.kaoqin) {
            kaoqin += data.kaoqin
          }

        }
      }
    }
    this.totalData.onlineSign = onlineSign;
    this.totalData.kaoqin = kaoqin;
    this.totalData.signCountOffline = signCountOffline;
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
      this.totalData.stdSignOfflineTime = stdSignOfflineTime + signTime;
      if (this.totalData.stdSignOfflineTime) {
        this.totalData.offlineEfficiency = effectiveOutput / this.totalData.stdSignOfflineTime
      }
      this.totalData.effectiveOutput = effectiveOutput;
      this.totalData.signTime = signTime;
    }
    this.workShop.totalData = this.totalData;
    // 统计ALL
    if (this.rpsBoardService.isFour) {
      // this.rpsBoardService.totalData
      const newTotalData = new TotalData();
      for (const key in this.rpsBoardService.fourBlock) {
        if (Object.prototype.hasOwnProperty.call(this.rpsBoardService.fourBlock, key)) {
          const totalData = this.rpsBoardService.fourBlock[key].totalData;
          if (totalData) {
            newTotalData.kaoqin += totalData.kaoqin;
            newTotalData.signTime += totalData.signTime;
            newTotalData.effectiveOutput += totalData.effectiveOutput;
            newTotalData.onlineSign += totalData.onlineSign;
            newTotalData.signCountOffline += totalData.signCountOffline;
            newTotalData.stdSignOfflineTime += totalData.stdSignOfflineTime;
          }
        }
      }
      if (newTotalData.signTime) {
        newTotalData.onlineEfficiency = newTotalData.effectiveOutput / newTotalData.signTime;
      }
      if (newTotalData.stdSignOfflineTime) {
        newTotalData.offlineEfficiency = newTotalData.effectiveOutput / newTotalData.stdSignOfflineTime
      }
      this.rpsBoardService.totalData = newTotalData;
    }


  }
  banCidate = '';
  getAllData(errorCount = 0) {
    if (errorCount >= 3) return;
    let url = "/yieldDashboard/worksectionData/" + this.workShop.workShopCode;
    if (this.rpsBoardService.date && this.rpsBoardService.dateMode) {
      url += `/${this.rpsBoardService.dateMode}/${this.rpsBoardService.date}`
    }
    // this.http.getHttpAllUrl("http://172.18.3.202:8080/yieldDashboard/worksectionData/" + this.workShop.workShopCode).subscribe((data: UrlData) => {
    this.signSection = {
      "WAVE": {
        kaoqin: 0,
        paiban: 0,
        signCountAll: 0
      },
      "COATING": {
        kaoqin: 0,
        paiban: 0,
        signCountAll: 0
      },
      "SMT": {
        kaoqin: 0,
        paiban: 0,
        signCountAll: 0
      },
      "ATP": {
        kaoqin: 0,
        paiban: 0,
        signCountAll: 0
      },
    };


    this.isAllLoading = true;
    this.http.getHttp(url).subscribe((data: UrlData) => {
      this.signSection = data.data.signSection || {};
      if (this.signSection.sectionData) {
        for (const iterator of this.signSection.sectionData) {
          this.signSection[iterator.sectionCode] = iterator;
        }
      }
      let nowDate = new Date();
      console.log('this.data', data, this.signSection)

      if (this.signSection.shiftType === '夜班' && nowDate.getHours() < 9 && nowDate.getMinutes() <= 30) {
        nowDate = addDays(nowDate, -1);
      }
      // console.log('getAllData', nowDate.getHours(), nowDate.getMinutes(),nowDate.getDate())

      // console.log('getAllData', nowDate.getHours(), nowDate.getMinutes())
      // nowDate.getHours
      const body2 = {
        "FDate": this.datePipe.transform(nowDate, 'yyyy-MM-dd'),
        "FShift": this.signSection.shiftType === '白班' ? "DayShift" : 'NightShift',
        "FactoryCode": this.workShop.workShopCode,
        "Fkind": "0"
      }
      const body3 = {
        "FDate": this.datePipe.transform(nowDate, 'yyyy-MM-dd'),
        "FShift": this.signSection.shiftType === '白班' ? "DayShift" : 'NightShift',
        "FactoryCode": this.workShop.workShopCode,
        "Fkind": "1"
      }
      if (this.rpsBoardService.date && this.rpsBoardService.dateMode) {
        body2.FDate = this.rpsBoardService.date
        body2.FShift = this.rpsBoardService.dateMode
        body3.FDate = this.rpsBoardService.date
        body3.FShift = this.rpsBoardService.dateMode
      }
      this.banCidate = body2.FDate + '_' + body2.FShift
      this.http.postHttpAllUrl('http://172.16.8.28:8088/api/getkp', body2).subscribe((data: any) => {
        console.log('getkp0', data)
        if (data.data && data.data.length) {
          for (const iterator of data.data) {
            if (this.signSection[iterator['WORK_SHOP_CODE']]) {
              this.signSection[iterator['WORK_SHOP_CODE']]['kaoqin'] = iterator['HeadCount']
            }
          }
        }
        this.getTotalData();
      })

      this.http.postHttpAllUrl('http://172.16.8.28:8088/api/getkp', body3).subscribe((data: any) => {
        console.log('getkp1', data)
        if (data.data && data.data.length) {
          for (const iterator of data.data) {
            if (this.signSection[iterator['WORK_SHOP_CODE']]) {
              this.signSection[iterator['WORK_SHOP_CODE']]['paiban'] = iterator['HeadCount']
            }
          }
        }
      })

      for (const option of options) {
        console.log('data', option.key, data);
        const dataList = data.data[option.key];
        let effectiveOutput = 0;
        let signTime = 0;
        const oneData = this.allData[option.index[0]][option.index[1]];
        oneData.totalData = new TotalData();
        const sectionData = this.signSection[option.key];
        if (dataList) {
          for (const iterator of dataList) {
            effectiveOutput += iterator.effectiveOutput;
            signTime += iterator.signTime;
          }
          oneData.totalData.effectiveOutput = effectiveOutput;
          if (signTime) {
            oneData.efficiency = effectiveOutput / signTime;
            if (sectionData) {
              oneData.offlineEfficiency = (effectiveOutput) / (signTime + sectionData.stdSignOfflineTime);
            }
          }
          oneData.isLoading = true;
          oneData.data = dataList
          oneData.title = option.title;

          setTimeout(() => {
            // 模拟数据
            if (dataList.length > 0)
              oneData.isLoading = false;
            else {
              // TODO 无数据
              oneData.isLoading = false;
            }
          }, 1);
        } else {
          oneData.data = [];
          oneData.title = option.title;
          oneData.isLoading = false;

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
      this.isAllLoading = false;


    },
      error => {
        console.error('getAllData', this.workShop.workShopCode)
        this.getAllData(errorCount + 1);
        this.isAllLoading = false;
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

  export() {
    if (this.isAllLoading) {
      this.msg.error('请等待数据加载后再点击导出')
      return;
    }
    console.log('this.totalData', this.totalData, this.signSection, this.allData)
    const workbook = new Excel.Workbook();
    const sheet1 = workbook.addWorksheet('汇总数据')
    const sheet2 = workbook.addWorksheet('产线效率', { views: [{ state: 'frozen', ySplit: 1 }] })
    const sheet3 = workbook.addWorksheet('产品工时', { views: [{ state: 'frozen', ySplit: 1 }] })
    const sheet4 = workbook.addWorksheet('异常数据')

    this.export1(sheet1);
    this.export2(sheet2);
    this.export3(sheet3);
    this.export4(sheet4);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let name = this.workShop.workShopCode+'工段看板_'+this.banCidate;

      fs.saveAs(blob, name + '.xlsx');

    })





  }
  export1(sheet1: any) {
    sheet1.columns = [
      { header: '类别', key: 'name', width: 8 },
      { header: '在线效率', key: 'onlineEfficiency', width: 10, style: { numFmt: '0.00%' } },
      { header: '离线效率', key: 'offlineEfficiency', width: 10, style: { numFmt: '0.00%' } },
      { header: '在线签到工时', key: 'signTime', width: 12, style: { numFmt: '0.00' } },
      { header: '总签到工时', key: 'stdSignOfflineTime', width: 10, style: { numFmt: '0.00' } },
      { header: '计件工时', key: 'effectiveOutput', width: 10, style: { numFmt: '0.00' } },
      { header: '排班人数', key: 'paiban', width: 10, },
      { header: '考勤人数', key: 'kaoqin', width: 10, },
      { header: '在线签到人数', key: 'onlineSign', width: 12, },
      { header: '离线签到人数', key: 'signCountOffline', width: 12, },
    ];
    const sheet1Data: TotalData[] = [];
    const totalData = JSON.parse(JSON.stringify(this.totalData));
    totalData.paiban = 0;
    for (const oneDatas of this.allData) {
      for (const bigData of oneDatas) {
        const key = bigData.key;
        const item = new TotalData();
        const data = this.signSection[key as WorkType];
        item.name = key;
        item.onlineSign = data.signCountAll;
        item.kaoqin = data.kaoqin || 0;
        item.paiban = data.paiban || 0;
        item.signCountOffline = data.signCountOffline;
        item.signTime = (data.signAllTime || 0) / 3600;
        item.stdSignOfflineTime = (data.stdSignOfflineTime + data.signAllTime) / 3600;
        item.effectiveOutput = (bigData.totalData.effectiveOutput || 0) / 3600;
        if (item.signTime) {
          item.onlineEfficiency = item.effectiveOutput / item.signTime;
          if (item.stdSignOfflineTime) {
            item.offlineEfficiency = item.effectiveOutput / item.stdSignOfflineTime;
          }
        }
        totalData.paiban += item.paiban;
        sheet1Data.push(item);
      }
    }
    totalData.name = '全厂';
    totalData.signTime /= 3600;
    totalData.stdSignOfflineTime /= 3600;
    totalData.effectiveOutput /= 3600;
    sheet1Data.push(totalData);
    sheet1.addRows(sheet1Data);
  }
  export2(sheet2) {
    // 计算停线累计时间
    const errorTimes: { [key: string]: number } = {}
    for (const iterator of this.rightData) {

      if (!errorTimes[iterator.FLocation]) {
        errorTimes[iterator.FLocation] = 0;
      }
      errorTimes[iterator.FLocation] += iterator.FStopLineDate;
    }
    sheet2.columns = [
      { header: '工厂', key: 'workShopCode', width: 10 },
      { header: '工段', key: 'workType', width: 8 },
      { header: '产线', key: 'prolineCode', width: 18 },
      { header: '不良', key: 'badNums', width: 8 },
      { header: '良率', key: 'yield', width: 10, style: { numFmt: '0.00%' } },
      { header: '产出', key: 'goodNums', width: 8 },
      { header: '计划', key: 'planNums', width: 8, },
      { header: '达成率', key: 'planAchievementRate', width: 10, style: { numFmt: '0.00%' } },
      { header: '计件工时', key: 'effectiveOutput', width: 10, style: { numFmt: '0.00' } },
      { header: '签到人数', key: 'signWorker', width: 8, },
      { header: '签到人员', key: 'signWorkerName', width: 12, },
      { header: '签到工时', key: 'signTime', width: 10, style: { numFmt: '0.00' } },
      { header: '效率', key: 'efficiency', width: 10, style: { numFmt: '0.00%' } },
      { header: '合计异常小时', key: 'errorTime', width: 12, style: { numFmt: '0.00' } },
    ];
    const sheetData: Data[] = [];
    const allData: BigData[][] = JSON.parse(JSON.stringify(this.allData));
    for (const oneDatas of allData) {
      for (const bigData of oneDatas) {
        for (const data of bigData.data) {
          data.workShopCode = this.workShop.workShopCode;
          data.workType = bigData.key;
          data.signWorker = data.efficiencyFormula ? data.efficiencyFormula.signWorker : 0
          data.effectiveOutput /= 3600;
          data.signTime /= 3600;
          data.yield /= 100;
          data.planAchievementRate /= 100;
          data.efficiency /= 100;
          data.errorTime = (errorTimes[data.prolineCode] / 60) || null
          data.signWorkerName=data.efficiencyFormula.signWorkerName
        }
        sheetData.push(...bigData.data);
      }
    }

    sheet2.addRows(sheetData);
  }
  export3(sheet3) {
    sheet3.columns = [
      { header: '产线', key: 'prolineCode', width: 18 },
      { header: '产品', key: 'productCode', width: 18 },
      { header: '产出', key: 'produce', width: 10 },
      { header: '计件工时', key: 'effectiveOutput', width: 10, style: { numFmt: '0.00' } },
      { header: '标准人力', key: 'stdHuman', width: 10 },
      { header: 'UPH', key: 'stdUph', width: 10, style: { numFmt: '0.00' } },
      { header: '合板数量', key: 'quantity', width: 10 },
      { header: 'CT', key: 'stdCt', width: 10 },
      { header: '工时异常原因', key: 'errorMsg', width: 12 },
    ];
    const sheetData: EfficiencyFormulaProd[] = [];
    const allData: BigData[][] = JSON.parse(JSON.stringify(this.allData));
    for (const oneDatas of allData) {
      for (const bigData of oneDatas) {
        for (const data of bigData.data) {
          if (data.efficiencyFormula && data.efficiencyFormula.efficiencyFormulaProd) {
            for (const proData of data.efficiencyFormula.efficiencyFormulaProd) {
              proData.prolineCode = data.prolineCode;
              proData.effectiveOutput /= 3600;
              proData.errorMsg = proData.errorMsg || '';
              proData.quantity = parseInt((proData.quantity + '').trim())
            }
            sheetData.push(...data.efficiencyFormula.efficiencyFormulaProd);
          }
        }
      }
    }
    sheet3.addRows(sheetData);
  }
  export4(sheet4) {
    const head = [
      { header: '产线', key: 'FLocation', width: 18 },
      { header: '编号', key: 'FBillNo', width: 18 },
      { header: '状态', key: 'FState', width: 10 },
      { header: '原因', key: 'FReason', width: 20 },
      { header: '累计停线', key: 'FStopLineDate', width: 10 },
      { header: '发起人', key: 'FCallUserName', width: 10 },
      { header: '发起时间', key: 'FCallDate', width: 20 },
      { header: '响应人', key: 'FRespUserName', width: 8 },
      { header: '响应时间', key: 'FRespDate', width: 8 },
      { header: '维修人', key: 'FMaintUserName', width: 8 },
      { header: '维修时间', key: 'FMaintDate', width: 8 },
      // { header: '关闭时间', key: 'FMaintDate', width: 10 },
      // { header: '呼叫人员', key: 'errorMsg', width: 12 },
    ];
    sheet4.columns = head;
    // sheet4.autoFilter = 'A1:' + indexToColName(head.length - 1) + '1';

    sheet4.addRows(this.rightData);
    // this.rightData
  }
}

function indexToColName(index: number): string {
  if (index < 0) {
    return null;
  }
  let num = 65;// A的Unicode码
  let colName = "";
  do {
    if (colName.length > 0) {
      index--;
    }
    let remainder = index % 26;
    colName = String.fromCharCode(remainder + num) + colName;
    index = parseInt(((index - remainder) / 26) + '');
  } while (index > 0);
  return colName;
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