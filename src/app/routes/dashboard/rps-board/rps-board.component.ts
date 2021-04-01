import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Data, getTestData, UrlData } from "./datas";
import { fromEvent as observableFromEvent, of as observableOf, Subscriber } from 'rxjs';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';
import { RpsBoardService } from './rps-board.service';
import { orderBy, slice, map, groupBy } from 'lodash';


const FactoryCode = {
  'SUZ15-1F': 'SUZ01',
  'SX-P1': 'SUZ01',
  'SUZ21-2F': 'SUZ02',
  'SX-P2': 'SUZ02',
  'SUZ15-2F': 'SUZ03',
  'SX-P3': 'SUZ03',
  'SUZ21-1F': 'SUZ04',
  'SX-P6': 'SUZ04',
}

const options: {
  key: string,
  title: string,
  index: number[]
}[] = [
    {
      key: 'SMT',
      title: 'SMT达成率',
      index: [0, 0]
    },
    {
      key: 'WAVE',
      title: 'WAVE达成率',
      index: [0, 1]
    },

    {
      key: 'COATING',
      title: 'COATING达成率',
      index: [1, 0]
    },
    {
      key: 'ATP',
      title: 'ATP达成率',
      index: [1, 1]
    },
  ]

@Component({
  selector: 'app-rps-board',
  templateUrl: './rps-board.component.html',
  styleUrls: ['./rps-board.component.less']
})
export class RpsBoardComponent implements OnInit {
  changePageTime = 15;
  ngModelChange(event) {
    this.rpsBoardService.pageChangeTime$.next(event);
  }
  isError = false;
  errorIconSize = 100;
  isVisibleErrorDetail = false;
  currentErrorInfo:ErrorInfo
  leftSpan = 20
  workshopCode = '';
  /** 标准 */
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

  allData: {
    title: string;
    data: Data[];
    isLoading?: boolean;
  }[][] = [];
  topData: {
    title: string;
    data: Data[];
    isLoading?: boolean;
  }[] = [];
  bottomData: {
    title: string;
    data: Data[];
    isLoading?: boolean;
  }[] = [];
  fontSizeTitle1 = 42;//一级标题
  fontSizeTitle2 = 24;//二级标题
  tableSize: 'middle' | 'small' = 'middle';
  private nowTimeTimer;
  nowTime = Date.now();
  rightShow: ErrorInfo[] = [];
  rightOther: ErrorInfo[] = [];
  rightData: ErrorInfo[] = []

  private dataTimer;
  private rightTimer;

  @ViewChild('errorBox') errorBox: ElementRef;


  @ViewChild('errodHead') errodHead: ElementRef;

  constructor(private http: HttpService, private route: ActivatedRoute, private pageService: PageService, private rpsBoardService: RpsBoardService) {

  }

  ngOnInit() {
    this.getRouteParam();
    console.log('window.screen.height', window.screen.width, window.screen.height)
    if (window.screen.height <= 900) {
      this.fontSizeTitle1 = 32;//一级标题
      this.fontSizeTitle2 = 18;//二级标题
      this.tableSize = "small";
    }
    this.autoSize();
    this.nowTimeTimer = setInterval(() => this.nowTime = Date.now(), 1000)

    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
    if (this.rightTimer) {
      clearInterval(this.rightTimer);
    }

    this.initData();
    this.getAllData();
    this.dataTimer = setInterval(() => {
      this.getAllData();
      this.getErrorData();
    }, 5 * 60 * 1000)

    this.getErrorData()
    this.rightTimer = setInterval(() => {
      this.changePage(this.rightData, this.nzPageSize);
    }, 15 * 1000)
  }


  pageChange() {
    // this.rpsBoardService.changePage(this.rightData, this.rightShow, this.rightOther);
  }
  getErrorData() {
    console.log('getErrorData do')
    let factoryCode = FactoryCode[this.workshopCode];
    if (!factoryCode) factoryCode = this.workshopCode;
    this.http.postHttpAllUrl('http://172.16.8.28:8088/api/getAbnormalInfo', { FactoryCode: factoryCode }).subscribe(
      (data: {
        data: { CallInfo: ErrorInfo[], CallUserInfo: CallUserInfo[], ErrorCode: number, Msg?: string }
      }) => {
        // console.log('getErrorData', data)  ||
        if (data.data.ErrorCode === 0) {
          this.rightData = data.data.CallInfo;
          let index = 0;
          this.isError = false;
          const errorData = groupByToJson(data.data.CallUserInfo, 'FBillNo')
          for (const iterator of this.rightData) {
            iterator.callUserInfo=errorData[iterator.FBillNo]||[];
            iterator.index = ++index;
            switch (iterator.FState) {
              case '已维修':
                iterator.status = 'success';
                break;
              case '已关闭':
                iterator.status = 'success';
                break;
              case '待响应':
                this.isError = true;
                iterator.status = 'error';
                break;
              case '已响应':
                this.isError = true;
                iterator.status = 'warning';
                break;

              default:
                break;
            }
          }
          console.log('errorData',errorData,this.rightData)
          this.changeSize()
        } else {
          this.isError = false
          this.rpsBoardService.clearAll(this.rightData, this.rightShow, this.rightOther)
          // this.rightData = [];
          // for (let index = 0; index < 20; index++) {
          //   this.rightData.push({
          //     index: (index + 1),
          //     "FBillNo": (index + 1) + '',
          //     "FLocation": "SUZ21SMT-A",
          //     "FReason": "XP异常中",
          //     "FCallDate": "2021-03-23 22:27:03",
          //     "FCallUser": "2011024",
          //     "FCallUserName": "绪立成",
          //     "FRespUser": "",
          //     "FRespUserName": "",
          //     "FMaintUserCode": "2011024",
          //     "FMaintUserName": "绪立成",
          //     "FRespDate": 3936,
          //     "FMaintDate": 5754,
          //     "FStopLineDate": 8002,
          //     "FactoryCode": "SUZ01",
          //     "FState": "已维修"
          //   })
          // }
          // this.changeSize()

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

    const pagesize = Math.floor(errorListHeight / (163 + 5) + 0.05)
    this.nzPageSize = pagesize;
    this.changePage(this.rightData, this.nzPageSize, true);
  }
  initDatas() {
    this.rightOther = [...this.rightData];
    this.rightShow = [];

  }
  async changePage(allData: any[], size: number, init: boolean = false) {

    if (init) {
      this.initDatas()
    }

    let rightShow = []
    if (allData.length === 0) {
      return;
    }

    if (size >= allData.length) {
      rightShow = [...allData];
      this.rightShow = rightShow;
      return;
    }

    const ToRight = []
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
    for (const iterator of ToRight) {
      this.rightOther.push(iterator);
    }
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    //  TODO 残缺补全
    // }
    this.rightShow = rightShow;
  }
  initData() {
    console.log('getAllData')
    this.topData = [];
    this.bottomData = [];
    this.allData = [];
    this.topData.push({
      title: 'SMT达成率',
      data: getTestData(),
      isLoading: true
    })
    this.topData.push({
      title: 'WAVE达成率',
      data: getTestData(),
      isLoading: true
    })

    this.bottomData.push({
      title: 'COATING达成率',
      data: getTestData(),
      isLoading: true
      // data:[]
    })
    this.bottomData.push({
      title: 'ATP达成率',
      data: getTestData(),
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
  getAllData() {
    // this.http.getHttpAllUrl("http://172.18.3.202:8080/yieldDashboard/worksectionData/" + this.workshopCode).subscribe((data: UrlData) => {
    this.http.getHttp("/yieldDashboard/worksectionData/" + this.workshopCode).subscribe((data: UrlData) => {
      for (const option of options) {
        // console.log('data', option.key, data);
        const dataList = data.data[option.key];
        if (dataList) {
          this.allData[option.index[0]][option.index[1]].isLoading = true;
          this.allData[option.index[0]][option.index[1]].data = dataList
          this.allData[option.index[0]][option.index[1]].title = option.title;
          setTimeout(() => {
            // 模拟数据
            if (dataList.length > 0)
              this.allData[option.index[0]][option.index[1]].isLoading = false;
          }, 1);
        } else {
          this.allData[option.index[0]][option.index[1]].data = [];
          this.allData[option.index[0]][option.index[1]].title = option.title;
          this.allData[option.index[0]][option.index[1]].isLoading = false;

        }
      }
      if (data.data.planAchievementRate) {
        this.standard.complete = data.data.planAchievementRate
      }
      if (data.data.yield) {
        this.standard.yield = data.data.yield
      }

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
        if (this.lastHeight < window.innerHeight) {
          console.log('this.lastHeight', this.lastHeight, window.innerHeight)
          // this.pageChangeInit()
        }
        if (window.innerHeight > 2000) {
          this.errorIconSize = 160;
        } else {
          this.errorIconSize = 100;
        }
        setTimeout(() => {
          this.changeSize()
        }, 10);
        if (this.lastHeight) this.lastHeight = window.innerHeight;

      });
  }

  ngOnDestroy() {
    if (this.nowTimeTimer) {
      clearInterval(this.nowTimeTimer);
    }
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
    }
  }
  queryParamStr = ""
  getRouteParam() {
    let path = this.pageService.getPathByRoute(this.route);
    //监听路径参数
    this.pageService.setRouteParamsByRoute(this.route, path);
    //初始化参数识别字串
    this.queryParamStr = '';
    for (const key in this.pageService.routeParams[path]) {
      if (this.pageService.routeParams[path].hasOwnProperty(key)) {
        this.queryParamStr = this.queryParamStr + this.pageService.routeParams[path][key];
      }
    }
    //  path 可不传
    //  this.activatedRoute 需保证准确
    this.workshopCode = this.pageService.getRouteParams(this.route, 'workshopCode', path);
    if (!this.workshopCode) this.workshopCode = '-1';
    console.log('workshopCode,shiftTypeCode', this.workshopCode);

  }
  showErrorDetail(errorInfo:ErrorInfo){
    this.currentErrorInfo=errorInfo;
    this.isVisibleErrorDetail=true;
  }
}

function groupByToJson<E extends { [key: string]: any }>(list: E[], key: (keyof E)): { [key: string]: E[] } {
  let res: { [key: string]: E[] } = {};
  for (const item of list) {
    const id = item[key]
    if (!res[id]) res[id] = [];
    res[id].push(item);
  }
  return res;
}

interface ErrorInfo {
  "FBillNo": string;
  "FLocation": string;
  "FReason": string;
  "FCallDate": string;
  "FCallUser": string;
  "FCallUserName": string;
  "FRespUser": string;
  "FRespUserName": string;
  "FMaintUserCode": string;
  "FMaintUserName": string;
  "FRespDate": number;
  "FMaintDate": number;
  "FStopLineDate": number;
  "FactoryCode": string;
  "FState": '已维修' | '已关闭' | '待响应' | '已响应';
  index?: number;
  status?: string;
  callUserInfo?: CallUserInfo[]

}
interface CallUserInfo {
  /** 姓名 */
  A0101: string;
  FBillNo: string;
  FDate: string;
  FUserCode: string;
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