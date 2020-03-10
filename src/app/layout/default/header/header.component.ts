import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { HttpService } from 'ngx-block-core';
import { environment } from '@env/environment';
import { ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

const home_url = environment.HOME_URL;

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[NzNotificationService]
})
export class HeaderComponent implements OnInit {
  searchToggleStatus: boolean;
  releaseData;
  placement = 'topRight';
  versiontimer: any;
  countdowntimer: any;
  countdown = 4;
  pathName = "";
  releaseUrl = "";
  @ViewChild('template')
  tplRef: TemplateRef<any>;
  @ViewChild('tplContent')
  tplContentRef: TemplateRef<any>;


  constructor(public settings: SettingsService,
    public httpService: HttpService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private location: PlatformLocation) {
    this.versiontimer = setTimeout(this.getClock, 0);
  }

  ngOnInit() {

    this.pathName = this.location.pathname + this.location.search;
    console.log("当前路由", this.pathName)
    
  }

  getClock = () => {
    if (this.versiontimer) {
      clearTimeout(this.versiontimer);
    }
    this.checkVersion();
    this.versiontimer = setTimeout(this.getClock, 300000);
  }
  getCountdown = () => {
    if (this.countdowntimer) {
      clearTimeout(this.countdowntimer);
    }
    console.log("倒计时", this.countdown)
    if (this.countdown <= 0) {
      clearInterval(this.countdowntimer);
      this.gotoAlternateServer(this.releaseUrl);
    } else {
      this.countdown--;
      this.countdowntimer = setTimeout(this.getCountdown, 1000);
    }

  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  /**
* 检测版本
*/
  checkVersion() {

    let version = {
      home_url: home_url
    };
    this.httpService.postHttpAllUrl("http://172.16.8.107/cloudblock_oracle/release/info", version).subscribe((data: any) => {

      this.releaseData = data.data;
      this.releaseUrl = this.releaseData.releaseUrl + this.pathName;
      console.log("版本发布数据", this.releaseData);
      
      switch (this.releaseData.switchSystem) {
        //提醒
        case "1":
          this.createBasicNotification(this.tplRef);
          break;
        //强制
        case "2":
          this.createConfirm();

          break;
        default:

          break;

      }
      console.log("版本发布检测", data);


    }, (err) => {
      console.log("版本发布检测-接口异常");

    });

  }

  createBasicNotification(template: TemplateRef<{}>): void {
    this.notification.remove();
    this.notification.config({
      nzDuration: 0,
      nzPlacement: this.placement
    });
    this.notification.template(template);
  }

  createConfirm() {
    this.modalService.closeAll();
    this.modalService.warning({
      nzTitle: '系统维护中，正在为您跳转至备用服务器。',
      nzContent: this.tplContentRef,
      nzOnOk: () => this.gotoAlternateServer(this.releaseUrl)
    });
    this.countdowntimer = setTimeout(this.getCountdown, 0);

  }

  gotoAlternateServer(url) {

    window.location.reload();


  }
}
