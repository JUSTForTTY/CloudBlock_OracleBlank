import { Component, OnInit } from '@angular/core';
import { Data, getTestData, UrlData } from "./datas";
import { fromEvent as observableFromEvent, of as observableOf } from 'rxjs';
import { HttpService, PageService } from 'ngx-block-core';
import { ActivatedRoute } from '@angular/router';

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

  private dataTimer;
  constructor(private http: HttpService, private route: ActivatedRoute, private pageService: PageService,) {

  }

  ngOnInit() {
    this.getRouteParam();
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
    this.initData();
    this.getAllData();
    this.dataTimer = setInterval(() => {
      this.getAllData();
    }, 5 * 60 * 1000)

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
  autoSize() {
    observableFromEvent(window, 'resize')
      .subscribe((event) => {
        // 操作
        if (window.innerHeight <= 900) {
          this.fontSizeTitle1 = 32;//一级标题
          this.fontSizeTitle2 = 18;//二级标题
          this.tableSize = "small";
        } else {
          this.fontSizeTitle1 = 42;//一级标题
          this.fontSizeTitle2 = 24;//二级标题
          this.tableSize = 'middle';
        }

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
    if (!this.workshopCode) this.workshopCode = 'abc';
    console.log('workshopCode,shiftTypeCode', this.workshopCode);

  }
}
