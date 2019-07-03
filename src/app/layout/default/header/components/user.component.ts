import { Component, Inject, ChangeDetectionStrategy, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService} from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { UserService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { HttpService } from 'ngx-block-core';
import { Md5 } from "ts-md5/dist/md5";
@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar nzSize="default" [nzText]="userService.getCurrentUser()['csysUserRealname']" style="background-color:#87d068;" class="mr-sm"></nz-avatar>
      {{userService.getCurrentUser()['csysUserUsername']}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="resetting()"><i nz-icon type="user" class="mr-sm"></i>
        {{ 'menu.account.center' | translate }}
      </div>
      <div nz-menu-item routerLink="/pro/account/settings"><i nz-icon type="setting" class="mr-sm"></i>
        {{ 'menu.account.settings' | translate }}
      </div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i nz-icon type="logout" class="mr-sm"></i>
        {{ 'menu.account.logout' | translate }}
      </div>
    </div>
  </nz-dropdown>
  <nz-modal [(nzVisible)]="isVisible" nzTitle="更新密码" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
  <div nz-row>
    <div nz-col nzSpan="4"></div>
    <div nz-col nzSpan="16">
    <input nz-input type="password" autocomplete="new-password" placeholder="输入旧密码" [(ngModel)]="oldPassword" />
    </div>
    <div nz-col nzSpan="4"></div>
  </div>
  <div nz-row style="margin-top:20px">
    <div nz-col nzSpan="4"></div>
    <div nz-col nzSpan="16">
    <input nz-input type="password" autocomplete="new-password" placeholder="输入密码" [(ngModel)]="password1" />
    </div>
    <div nz-col nzSpan="4"></div>
  </div>
  <div nz-row style="margin-top:20px">
    <div nz-col nzSpan="4"></div>
    <div nz-col nzSpan="16">
    <input nz-input type="password" autocomplete="new-password" placeholder="确认密码" [(ngModel)]="password2" (ngModelChange)="confirm()"/>
    <p *ngIf="confirmPd" style="color:red">两次输入密码不相同，请重新输入！</p>
    </div>
    <div nz-col nzSpan="4"></div>
  </div>

  </nz-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent implements OnInit, DoCheck {
  constructor(
    public settings: SettingsService,
    private router: Router,
    public userService: UserService,
    private reuseTabService: ReuseTabService,
    private msg:NzMessageService,
    private httpService: HttpService,    
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  ngDoCheck(): void {   //触发变更检测机制就是调用DoCheck

    if (this.userService.getCurrentUser() == null) {
      this.router.navigateByUrl("/login");
    }

  }
  ngOnInit() {
    this.userService.populate();
  }

  logout() {
    //清理用户信息
    this.userService.purgeAuth();
    //清理reuse
    this.reuseTabService.clear();
    this.router.navigateByUrl("/login");
  }
  isVisible = false;
  confirmPd = false;
  password1:string;
  password2:string;
  content = "请重新输入";
  userid;
  oldPassword:string="";
  oldPassword1:string="";
  handleCancel(): void {
    this.isVisible = false;
    this.password1 = null;
    this.password2 = null;
  }
  handleOk(): void {
    if(this.password1 != this.password2){
      this.msg.error("密码不相同请重新输入!")
      return;
    }else{
      if (this.oldPassword1 !=  Md5.hashStr(this.oldPassword)) {
        this.msg.error("旧密码错误，请重新输入!")
        return;
      }
        let pData = {
          "csysUserId": this.userid,
          "csysUserPassword": this.password1
        }
        this.httpService.putHttp("/csysuser",pData).subscribe((data: any) => {
          this.msg.success("修改成功");
          this.isVisible = false;
          this.password1 = null;
          this.password2 = null;         
          this.userService.purgeAuth();
          //清理reuse
          this.reuseTabService.clear();
          this.router.navigateByUrl("/login");
        })
      
    }
    this.isVisible = false;
  }
  //点击
  resetting(): void {
    this.isVisible = true;
    this.userid = this.userService.getCurrentUser()['csysUserId'];
    this.oldPassword1 = this.userService.getCurrentUser()['csysUserPassword'];
  }
  confirm():void{
    this.confirmPd = true;
    if(this.password1 == this.password2){
      this.confirmPd = false;
    }
  
  }
}
