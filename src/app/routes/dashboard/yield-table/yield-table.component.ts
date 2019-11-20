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
    
    if(this.nzPageIndex<this.nzTotalPage){
      this.nzPageIndex++;
    }else{
      this.nzPageIndex=1;
    }
    console.log("分页信息", this.nzPageIndex)
    
    this.timer = setTimeout(this.setData, 8000);
  }

  getWipData = () => {
    if (this.wotimer) {
      clearTimeout(this.wotimer);
    }
    
    this.getWoWipData();

    this.wotimer = setTimeout(this.getWipData, 120000);
  }

  ngOnInit() {


    this.getWoWipData();

  }

  getWoWipData() {
    this.httpService.getHttp("/yieldDashboard/woWipData/" + this.prolineCode+"?prolineType="+this.prolineType).subscribe((woWipData: any) => {

      this.woWipTableData = woWipData.data;
      console.log("产线报表-在制工单数据", this.woWipTableData)
      this.woWipDataTransform();
    }, (err) => {
      console.log("看板数据-接口异常");

    });

  }

  woWipDataTransform() {

    let wpDatalength = this.woWipTableData.length;
    //当数据为空时，填充数据
    if (wpDatalength == 0) {
      for (let i = 0; i < 5; i++) {
        this.woWipTableData.push({});i
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
