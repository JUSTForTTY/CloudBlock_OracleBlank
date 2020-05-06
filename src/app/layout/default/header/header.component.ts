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
  providers: [NzNotificationService]
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
  //定时器
  private nzTimer;


  constructor(public settings: SettingsService,
    public httpService: HttpService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private location: PlatformLocation) {
    // this.versiontimer = setTimeout(this.getClock, 0);
  }
  version = environment.version;
  versionShow = false;
  ngOnInit() {

    this.pathName = this.location.pathname + this.location.search;
    console.log("当前路由", this.pathName)
    this.versionUpdate();
    this.nzTimer = setInterval(() => this.versionUpdate(), 60 * 1000)
  }
  versionUpdate() {

    let version = {
    };
    console.log("版本发布-本地", this.version);
    this.httpService.postHttpAllUrl("http://172.16.8.107/cloudblock_oracle/release/info", version).subscribe((data: any) => {
      console.log("版本发布", data)
      //线上版本大于本地，则提醒升级
      try {
        if (parseInt(data.data.csysReleaseVersion) > parseInt(this.version)) {
          console.log("版本发布-升级", data.data.csysReleaseVersion, this.version)
          if (!this.versionShow) {
            this.versionShow = true;
            this.modalService.create({
              nzTitle: '系统升级',
              nzContent: "检测到系统有升级，请尽快刷新。点击确定按钮可自动刷新。",
              nzClosable: true,
              nzOnOk: () => this.gotoAlternateServer(),
              nzOnCancel: () => { this.versionShow = false; }
            });
          }

        }
      } catch (error) {
        console.error('升级检测error',error);
        
      }


    }, (err) => {
      console.log("版本发布检测-接口异常");

    });

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
    console.log("版本发布", version);
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

  gotoAlternateServer(url?) {

    window.location.reload();


  }
  ngOnDestroy() {
    if (this.nzTimer) {
      clearInterval(this.nzTimer);
    }
  }
}
