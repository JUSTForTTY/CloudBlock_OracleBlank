import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';

@Component({
  selector: 'app-performance-test',
  templateUrl: './performance-test.component.html',
  styleUrls: ['./performance-test.component.less']
})
export class PerformanceTestComponent implements OnInit, OnDestroy {

  constructor(private httpService: HttpService) {
    this.clocktimer = setTimeout(this.getClock, 0);
  }
  clocktimer: any;
  ascriptiontimer: any;
  nowTime = Date.now();
  snsubffer = "ADW-TEST";
  //工单总归属量
  woNumber = 1500000;
  //当前归属量
  currentNumber: number = 1;

  //当前spi过站量
  currentFlowNumber: number = 1;

  percent = 0;

  percentFlow = 0;


  getClock = () => {
    if (this.clocktimer) {
      clearTimeout(this.clocktimer);
    }

    this.nowTime = Date.now();

    this.clocktimer = setTimeout(this.getClock, 1000);
  }

  doAscription = () => {

    if (this.currentNumber < this.woNumber) {

      this.autoAscription();

    }

  }
  doFlow = () => {

    if (this.currentFlowNumber < this.woNumber) {
      this.currentFlowNumber++;
      this.autoSpiCollect();


    }

  }

  ngOnInit() {

  }


  //自动归属工单
  autoAscription() {

    let snbegin = this.snsubffer + this.PrefixInteger(this.currentNumber, 8);
    this.currentNumber = Number(this.currentNumber) + 9999;
    let snend = this.snsubffer + this.PrefixInteger(this.currentNumber, 8);

    let body = {
      "dynamicSql": null, "paramMap":
        [{ "name": "SUCUCySysBlockSucu08searchweiget001000120190427002512", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
        { "name": "SUCUCySysBlockSucu08searchweiget001000120190427002509", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
        { "name": "SUCUCySysBlockSucu08searchweiget001000120190626002966", "columnName": "REMARK", "value": "ADW-TEST@@@@@@@@" },
        { "name": "SUCUCySysBlockSucu08searchweiget001000120190427002513", "columnName": "BARCODE_START", "value": snbegin },
        { "name": "SUCUCySysBlockSucu08searchweiget001000120190427002514", "columnName": "BARCODE_END", "value": snend },
        { "name": "&userid&", "columnName": "", "value": "SUCUCsysUser20190227000022" },
        { "name": "SUCUCySysBlockSucu08searchweiget001000120190617002850", "columnName": "RESOURCE_CODE", "value": "ATB_SUZ15SMT-SETUP" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/batchownershipworkorder/proData000710", body).subscribe((ascriptionData: any) => {

      console.log("自动归属工单", ascriptionData);
      this.percent = this.currentNumber / this.woNumber * 100;
      this.doAscription();

    }, (err) => {
      console.log("看板数据-接口异常");

    });


  }

  //自动spi采集
  autoSpiCollect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "SPI_SUZ15SMT-A"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动spi过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autoAoiCollect();

    }, (err) => {
      console.log("看板数据-接口异常");

    });


  }

  //自动spi2采集
  autoSpi2Collect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "SPI_SUZ15SMT-A"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动spi2过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autoAoi2Collect();

    }, (err) => {
      console.log("看板数据-接口异常");

    });


  }

  //自动aoi采集
  autoAoiCollect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "AOI_SUZ15SMT-A"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动aoi过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autoQcCollect();
    });


  }

  //自动aoi2采集
  autoAoi2Collect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "AOI_SUZ15SMT-A"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动aoi2过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autoQc2Collect();

    });


  }
  //自动qc采集
  autoQcCollect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "QC_SMT_SUZ15SMT-A"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动qc过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autoSpi2Collect();

    });


  }

  //自动qc2采集
  autoQc2Collect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "QC_SMT_SUZ15SMT-A"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动qc2过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autofQCCollect();

    });


  }
  //自动fqc采集
  autofQCCollect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "FQC-1_SUZ15BE-1"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动fqc过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autoFtCollect();

    });


  }
  //自动FT采集
  autoFtCollect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "FT-1_SUZ15BE-1"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动spi过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.autoQCpthCollect();

    });


  }
  //自动qc_pth
  autoQCpthCollect() {
    let sn = this.snsubffer + this.PrefixInteger(this.currentFlowNumber, 8);

    let body = {
      "dynamicSql": null,
      "paramMap": [{
        "name": "SUCUCySysBlockSucu08searchweiget001000120190618002859",
        "columnName": "RESOURCE_CODE", "value": "QC_PTH_SUZ15PTH-8"
      },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002860", "columnName": "PRO_LINE_CODE", "value": "SUZ15SMT-A" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002861", "columnName": "SECTION_CODE", "value": "SUZ15-2F-SMT" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002862", "columnName": "WORK_SHOP_CODE", "value": "SUZ15-2F" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002863", "columnName": "FACTORY_CODE", "value": "SUZ15" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002864", "columnName": "SHIFT_TYPE_CODE", "value": "2Shfit" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002865", "columnName": "SHIFT_CODE", "value": "Day Shift(白班)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190618002866", "columnName": "TIME_SLOT_CODE", "value": "白班" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002296", "columnName": "PRODUCT_CODE", "value": "ADW7708711-01(GM)" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002297", "columnName": "WO_CODE", "value": "ADW7708711-01(GM)-034BE" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190327002299", "columnName": "PRO_BAR_CODE", "value": sn },
      { "name": "SUCUCySysBlockSucu04weight009000120190523000076", "columnName": "BARCODE_GOOD_BADE", "value": "PASS" },
      { "name": "SUCUCySysBlockSucu04weight009000120190531000077", "columnName": "FLAG1", "value": "0" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190327000397", "columnName": "AB_SIDE_CODE", "value": "top" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190708003075", "columnName": "BAD_CODE_GROUP", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget002000120190509000446", "columnName": "BAD_CODE", "value": "" },
      { "name": "SUCUCySysBlockSucu08searchweiget001000120190704003050", "columnName": "BAD_SITE", "value": "" }]
    }

    console.log("数据检测", body);
    this.httpService.postHttp("/goodbadproductspage/proData000615", body).subscribe((spiData: any) => {

      console.log("自动spi过站", spiData);
      this.percentFlow = this.currentFlowNumber / this.woNumber * 100;

      this.doFlow();
    });


  }

  startSchedule() {

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
