import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';

@Component({
  selector: 'app-performance-test',
  templateUrl: './performance-test.component.html',
  styleUrls: ['./performance-test.component.less']
})
export class PerformanceTestComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService) { 
    this.clocktimer=setTimeout(this.getClock, 0);
  }
  clocktimer:any;
  ascriptiontimer:any;
  nowTime = Date.now();
  snsubffer="ADW-TEST";
  //工单总归属量
  woNumber=1500000;
  //当前归属量
  currentNumber=277972;

  percent=0;
  

  getClock = () => {
    if (this.clocktimer) {
      clearTimeout(this.clocktimer);
    }
   
    this.nowTime=Date.now();
 
    this.clocktimer = setTimeout(this.getClock, 1000);
  }

   doAscription = () => {
    
    if(this.currentNumber<this.woNumber){
      this.autoAscription();
       
    }
     
     
  }

  ngOnInit() {
     
  }


  //自动归属工单
  autoAscription() {
    
    let snbegin=this.snsubffer+this.PrefixInteger(this.currentNumber,8);
    this.currentNumber=this.currentNumber+9999
    let snend=this.snsubffer+this.PrefixInteger(this.currentNumber,8);

    let body={"dynamicSql":null,"paramMap":
    [{"name":"SUCUCySysBlockSucu08searchweiget001000120190427002512","columnName":"WO_CODE","value":"ADW7708711-01(GM)-034BE"},
    {"name":"SUCUCySysBlockSucu08searchweiget001000120190427002509","columnName":"PRODUCT_CODE","value":"ADW7708711-01(GM)"},
    {"name":"SUCUCySysBlockSucu08searchweiget001000120190626002966","columnName":"REMARK","value":"ADW-TEST@@@@@@@@"},
    {"name":"SUCUCySysBlockSucu08searchweiget001000120190427002513","columnName":"BARCODE_START","value":snbegin},
    {"name":"SUCUCySysBlockSucu08searchweiget001000120190427002514","columnName":"BARCODE_END","value":snend},
    {"name":"&userid&","columnName":"","value":"SUCUCsysUser20190227000022"},
    {"name":"SUCUCySysBlockSucu08searchweiget001000120190617002850","columnName":"RESOURCE_CODE","value":"ATB_SUZ15SMT-SETUP"}]}

    console.log("数据检测",body);
    this.httpService.postHttp("/batchownershipworkorder/proData000710",body).subscribe((ascriptionData: any) => {

       console.log("自动归属工单",ascriptionData);
       this.percent=this.currentNumber/this.woNumber*100;
       this.doAscription();

    });
    
 
  }

  startSchedule(){

    this.doAscription();
  }

  ngOnDestroy(): void {
    clearInterval(this.clocktimer);
    clearInterval(this.ascriptiontimer);

  }

   PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}
}
