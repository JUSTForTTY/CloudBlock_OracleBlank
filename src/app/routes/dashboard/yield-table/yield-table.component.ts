import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
@Component({
  selector: 'app-yield-table',
  templateUrl: './yield-table.component.html',
  styleUrls: ['./yield-table.component.less']
})
export class YieldTableComponent implements OnInit, OnDestroy {

  @Input() dataSet = [];
  @Input() prolineCode;
  @Input() prolineType;
  timer: any;
  wotimer: any;
  nzPageSize = 5;
  nzPageIndex = 1;
  nzTotal;
  nzTotalPage;


  woWipTableData = [];

  constructor(private httpService: HttpService) {
    this.timer = setTimeout(this.setData, 0);
    this.wotimer = setTimeout(this.getWipData, 0);
  }

  setData = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (this.nzPageIndex < this.nzTotalPage) {
      this.nzPageIndex++;
    } else {
      this.nzPageIndex = 1;
    }
    console.log("分页信息", this.nzPageIndex)

    this.timer = setTimeout(this.setData, 2 * 60 * 1000);
  }

  getWipData = () => {
    if (this.wotimer) {
      clearTimeout(this.wotimer);
    }

    this.getWoWipData();

    this.wotimer = setTimeout(this.getWipData, 2 * 60 * 1000);
  }

  ngOnInit() {


    this.getWoWipData();

  }

  waitTableData = [];
  woWipData = [];
  getWoWipData() {
    //在制
    this.httpService.getHttp("/yieldDashboard/woWipData/" + this.prolineCode + "?prolineType=" + this.prolineType).subscribe((woWipData: any) => {
      this.woWipData = woWipData.data;

      console.log("产线报表-工单在制数据", this.woWipTableData)
      //待排
      this.httpService.getHttp("/yieldDashboard/woPlanData/" + this.prolineCode + "?prolineType=" + this.prolineType).subscribe((waitData: any) => {

        console.log("产线报表-工单待排数据2", JSON.parse(JSON.stringify(waitData.data)))
        this.waitTableData = waitData.data;
        //组合数据
        this.groupData();
        this.woWipDataTransform();
      }, (err) => {
        console.log("看板数据-接口异常2");

      });

    }, (err) => {
      console.log("看板数据-接口异常1");

    });



  }
  groupData() {
    let woCodes = [];
    this.woWipData.forEach(element => {
      woCodes.push(element['woCode']);
    });
    for (let index = 0; index < this.waitTableData.length; index++) {
      const element = this.waitTableData[index];
      if (woCodes.indexOf(element['woCode']) >= 0) {
        this.waitTableData.splice(index, 1);
        index--;
      } else {
        element['opCode'] = element['sectionCode']
        element['produceNumber'] = element['outputNumber']
        element['smtWoState'] = "待排产"
        element['smtRealWorkDate'] = element['wiStartTime'] == '' ? "———— ————" : element['wiStartTime']
        element['smtCompleteWorkDate'] = element['wiOverTime'] == '' ? "———— ————" : element['wiStartTime']

      }
    }
    this.woWipTableData = [...this.waitTableData, ...this.woWipData]
  }

  woWipDataTransform() {

    let wpDatalength = this.woWipTableData.length;
    //当数据为空时，填充数据
    if (wpDatalength == 0) {
      for (let i = 0; i < 5; i++) {
        this.woWipTableData.push({}); i
      }
    } else {
      let mode = wpDatalength % this.nzPageSize;
      if (mode != 0) {
        let needpush = this.nzPageSize - mode;
        for (let i = 0; i < needpush; i++) {

          this.woWipTableData.push({});

        }
        this.nzTotalPage = Math.ceil(wpDatalength / this.nzPageSize);
      } else {
        this.nzTotalPage = wpDatalength / this.nzPageSize;

      }



    }
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
    clearInterval(this.wotimer);

  }

}
