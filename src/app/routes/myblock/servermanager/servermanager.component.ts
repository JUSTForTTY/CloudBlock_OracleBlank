import { Component, OnInit } from '@angular/core';
import { HttpService } from 'ngx-block-core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-servermanager',
  templateUrl: './servermanager.component.html',
  styleUrls: ['./servermanager.component.less']
})
export class ServermanagerComponent implements OnInit {

  constructor(private httpService: HttpService,private nzMessageService: NzMessageService) { }

  ngOnInit() {
    this.getServerData();
  }

  /**
    * -------------------------------------------服务器管理-------------------------------------------------
    */
  serverData = [];
  sdisSpinning = false;
  sdVisible = false;
  showServerDataList(): void {
    this.getServerData();
    this.sdVisible = true;
  }
  serverDataOk(): void {
    this.sdVisible = false;
    this.sdisSpinning = false;

  }
  //获得数据量表空间信息
  getServerData(): void {
    this.sdisSpinning = true;
    this.httpService.postHttp("csysdatabaseinfo/condition").subscribe((data: any) => {
      console.log("表服务器数据", data)
      this.serverData = data.data;
      this.sdisSpinning = false;
      console.log("表服务器数据", this.serverData)
    })
  }


  restartServer(serverName, type): void {
    this.httpService.getHttp("server/operation/" + serverName + "/" + type).subscribe((data: any) => {
      this.nzMessageService.info('服务器已重启！');

    })
  }
}
