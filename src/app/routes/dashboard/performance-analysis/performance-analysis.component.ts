import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';
import { getTimeDistance, deepCopy } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import { I18NService } from '@core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { yuan } from '@shared';
@Component({
  selector: 'app-performance-analysis',
  templateUrl: './performance-analysis.component.html',
  styleUrls: ['./performance-analysis.component.less']
})
export class PerformanceAnalysisComponent implements OnInit {

  constructor( 
    private http: _HttpClient,
    public msg: NzMessageService,
    private i18n: I18NService,
    private cdr: ChangeDetectorRef,
     ) { }

  form: FormGroup;
  fb: FormBuilder;
  data: any = {};
  loading = true;
  date_range: Date[] = [];
  rankingListData: any[] = Array(7)
    .fill({})
    .map((item, i) => {
      return {
        title: this.i18n.fanyi('app.analysis.test', { no: i }),
        total: 323234,
      };
    });
  titleMap = {
    y1: this.i18n.fanyi('app.analysis.traffic'),
    y2: this.i18n.fanyi('app.analysis.payments'),
  };
  searchColumn: STColumn[] = [
    { title: '排名', i18n: 'app.analysis.table.rank', index: 'index' },
    {
      title: '搜索关键词',
      i18n: 'app.analysis.table.search-keyword',
      index: 'keyword',
      click: (item: any) => this.msg.success(item.keyword),
    },
    {
      type: 'number',
      title: '用户数',
      i18n: 'app.analysis.table.users',
      index: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      type: 'number',
      title: '周涨幅',
      i18n: 'app.analysis.table.weekly-range',
      index: 'range',
      render: 'range',
      sorter: (a, b) => a.range - b.range,
    },
  ];

  salesType = 'all';
  salesPieData: any;
  salesTotal = 0;

  saleTabs: any[] = [{ key: 'sales', show: true }, { key: 'visits' }];

  offlineIdx = 0;

  ngOnInit() {
    this.http.get('/chart').subscribe((res: any) => {
      res.offlineData.forEach((item: any, idx: number) => {
        item.show = idx === 0;
        item.chart = deepCopy(res.offlineChartData);
      });
      this.data = res;
      this.loading = false;
      this.changeSaleType();
    });
    this.form = this.fb.group({
      resourceCode: [null, [Validators.required]],
      woCode: [null, [Validators.required]],
      snRule: [true],
      beginSequence: [null, [Validators.required]],
      endSequence: [null, [Validators.required]],

  });
  }

  setDate(type: any) {
    this.date_range = getTimeDistance(type);
    setTimeout(() => this.cdr.detectChanges());
  }
  changeSaleType() {
    this.salesPieData =
      this.salesType === 'all'
        ? this.data.salesTypeData
        : this.salesType === 'online'
        ? this.data.salesTypeDataOnline
        : this.data.salesTypeDataOffline;
    if (this.salesPieData) {
      this.salesTotal = this.salesPieData.reduce((pre, now) => now.y + pre, 0);
    }
    this.cdr.detectChanges();
  }

  handlePieValueFormat(value: any) {
    return yuan(value);
  }
  salesChange(idx: number) {
    if (this.saleTabs[idx].show !== true) {
      this.saleTabs[idx].show = true;
      this.cdr.detectChanges();
    }
  }
  offlineChange(idx: number) {
    if (this.data.offlineData[idx].show !== true) {
      this.data.offlineData[idx].show = true;
      this.cdr.detectChanges();
    }
  }

  //自动归属工单
  // autoAscription() {

  //   let snbegin = this.snsubffer + this.PrefixInteger(this.currentNumber, 9);
  //   this.currentNumber = Number(this.currentNumber) + 9999;
  //   let snend = this.snsubffer + this.PrefixInteger(this.currentNumber, 9);

  //   let body = {
  //     "dynamicSql": null, "paramMap":
  //       [{ "name": "SUCUCySysBlockSucu08searchweiget001000120190427002512", "columnName": "WO_CODE", "value": "MAJ200003458-0406BE" },
  //       { "name": "SUCUCySysBlockSucu08searchweiget001000120190427002509", "columnName": "PRODUCT_CODE", "value": "MAJ200003458" },
  //       { "name": "SUCUCySysBlockSucu08searchweiget001000120190626002966", "columnName": "REMARK", "value": "TY@@@@@@@@@" },
  //       { "name": "SUCUCySysBlockSucu08searchweiget001000120190427002513", "columnName": "BARCODE_START", "value": snbegin },
  //       { "name": "SUCUCySysBlockSucu08searchweiget001000120190427002514", "columnName": "BARCODE_END", "value": snend },
  //       { "name": "&userid&", "columnName": "", "value": "SUCUCsysUser20190227000022" },
  //       { "name": "SUCUCySysBlockSucu08searchweiget001000120190617002850", "columnName": "RESOURCE_CODE", "value": "ATB_SUZ15SMT-SETUP" }]
  //   }

  //   console.log("数据检测", body);
  //   this.httpService.postHttp("/batchownershipworkorder/proData000710", body).subscribe((ascriptionData: any) => {

  //     console.log("自动归属工单", ascriptionData);
  //     this.percent = this.currentNumber / this.woNumber * 100;
  //     this.doAscription();

  //   }, (err) => {
  //     console.log("看板数据-接口异常");

  //   });


  // }

}
