import { Component, Inject, ChangeDetectionStrategy, OnInit, DoCheck } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { UserService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { HttpService } from 'ngx-block-core';
import { Md5 } from "ts-md5/dist/md5";
import { Observable, Observer } from 'rxjs';
import { environment } from '@env/environment.prod';
const server_name = environment.SERVER_NAME
@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
    <nz-avatar *ngIf="userService.getCurrentUser()['csysUserHeadimage'] == ''" nzSize="default" [nzText]="userService.getCurrentUser()['csysUserRealname']" style="background-color:#87d068;" class="mr-sm"></nz-avatar>
    <nz-avatar *ngIf="userService.getCurrentUser()['csysUserHeadimage'] != ''" nzIcon="user" [nzSrc]="userService.resourceHttp + userService.getCurrentUser()['csysUserHeadimage']"></nz-avatar>
      {{userService.getCurrentUser()['csysUserUsername']}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="resetting()"><i nz-icon type="user" class="mr-sm"></i>
        {{ 'menu.account.center' | translate }}
      </div>
      <div nz-menu-item (click)="tabOption()"><i nz-icon type="setting" class="mr-sm"></i>
        {{ 'menu.account.settings' | translate }}
      </div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i nz-icon type="logout" class="mr-sm"></i>
        {{ 'menu.account.logout' | translate }}
      </div>
    </div>
  </nz-dropdown>
  <nz-modal [(nzVisible)]="isVisible" [nzTitle]="nzTitle" (nzOnCancel)="handleCancel()" (nzOnOk)="handleOk()">
  <div *ngIf="!tabView" nz-row>
    <div nz-col nzSpan="8"></div>
    <div nz-col nzSpan="8">
      <nz-upload [nzAction]="imgUrl" nzListType="picture-card" [nzShowUploadList]="showUploadList"
            [(nzFileList)]="fileList" [nzShowButton]="fileList.length < 1" [nzPreview]="handlePreview"
            [nzBeforeUpload]="beforeUpload" (nzChange)="handleChange($event)">
            <i nz-icon nzType="plus"></i>
          <div class="ant-upload-text">Upload</div>
          </nz-upload>
          <nz-modal [nzVisible]="previewVisible" [nzContent]="modalContent" [nzFooter]="null"
            (nzOnCancel)="previewVisible = false">
            <ng-template #modalContent>
              <img [src]="previewImage" [ngStyle]="{ width: '100%' }" />
            </ng-template>
          </nz-modal>
    </div>
    <div nz-col nzSpan="8"></div>
  </div>
  <div *ngIf="tabView">
    <div nz-row>
      <div nz-col nzSpan="4">旧密码：</div>
      <div nz-col nzSpan="16">
      <input nz-input type="password" autocomplete="new-password" placeholder="输入旧密码" [(ngModel)]="oldPassword" />
      </div>
      <div nz-col nzSpan="4"></div>
    </div>
    <div nz-row style="margin-top:20px">
      <div nz-col nzSpan="4">新密码：</div>
      <div nz-col nzSpan="16">
      <input nz-input type="password" autocomplete="new-password" placeholder="输入密码" [(ngModel)]="password1" />
      </div>
      <div nz-col nzSpan="4"></div>
    </div>
    <div nz-row style="margin-top:20px">
      <div nz-col nzSpan="4">确认密码：</div>
      <div nz-col nzSpan="16">
      <input nz-input type="password" autocomplete="new-password" placeholder="确认密码" [(ngModel)]="password2" (ngModelChange)="confirm()"/>
      <p *ngIf="confirmPd" style="color:red">两次输入密码不相同，请重新输入！</p>
      </div>
      <div nz-col nzSpan="4"></div>
    </div>
</div>
  </nz-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent implements OnInit, DoCheck {
  constructor(
    public settings: SettingsService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    public userService: UserService,
    private reuseTabService: ReuseTabService,
    private msg: NzMessageService,
    private httpService: HttpService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }
  refreshtoken;
  ngDoCheck(): void {   //触发变更检测机制就是调用DoCheck

    if (this.userService.getCurrentUser() == null) {
      this.router.navigateByUrl("/login");
    }

  }
  ngOnInit() {
    this.activeRouter.queryParams.subscribe(queryParams => {
      if(queryParams['refreshtoken']) this.refreshtoken = queryParams['refreshtoken'];   
    });
    if(typeof this.refreshtoken!="undefined"){
      console.log("原始数据检测",this.refreshtoken)
      window.localStorage['jwtRefreshToken' + server_name] = this.refreshtoken;
    } 
    this.userService.populate();

    //检测用户是否为初始化状态，如果是则需要修改密码
    this.getUserStatus();

  }

  logout() {
    //清理用户信息
    this.userService.purgeAuth();
    //清理reuse
    this.reuseTabService.clear();
    this.router.navigateByUrl("/login");
  }
  headUrl = ""
  isVisible = false;
  confirmPd = false;
  password1: string;
  password2: string;
  handImg;
  tabView = false;
  nzTitle = "修改密码";
  content = "请重新输入";
  userid;
  oldPassword: string = "";
  oldPassword1: string = "";
  imgUrl = environment.SERVER_URL + "v1/photoUpload";
  handleCancel(): void {
    this.isVisible = false;
    this.password1 = null;
    this.password2 = null;
    this.oldPassword = null;
  }
  handleOk(): void {
    if (this.nzTitle == "修改头像") {
      this.updateHeadImage();
    } else {
      this.updatePassword();
    }

  }
  getHeadImg(): void {

  }
  tabOption(): void {
    this.nzTitle = "修改头像";
    this.tabView = false;
    this.isVisible = true;
    this.handImg = environment.RESOURCE_SERVER_URL + this.userService.getCurrentUser()['csysUserHeadimage'];
    this.fileList = [
      {
        uid: -1,
        name: '头像',
        status: 'done',
        url: environment.RESOURCE_SERVER_URL + this.userService.getCurrentUser()['csysUserHeadimage']
      }
    ];
  }
  updateHeadImage(): void {
    let imgUrl = "";
    if (this.fileList.length == 0) {
      imgUrl = ""
    } else {
      console.log("fill", this.fileList);
      if (this.fileList[0].response) {
        imgUrl = this.fileList[0].response[0].fileUrl
      } else {
        imgUrl = this.fileList[0].url;
      }
    }
    let headImgData = {
      "csysUserId": this.userService.getCurrentUser()['csysUserId'],
      "csysUserHeadimage": imgUrl//头像     
    }
    this.httpService.putHttp("/csysuser", headImgData).subscribe((data: any) => {
      this.userService.populate();
      this.isVisible = false;
    });
  }
  updatePassword(): void {

    if (this.password1 == null || this.password2 == null) {
      this.msg.error("密码不能为空");
      return;
    }
    if (this.password1 != this.password2) {
      this.msg.error("密码不相同请重新输入!");
      return;
    } else {
      if (this.oldPassword1 != Md5.hashStr(this.oldPassword)) {
        this.msg.error("旧密码错误，请重新输入!");
        return;
      }
      let pData = {
        "csysUserId": this.userid,
        "csysUserPassword": this.password1,
        "csysUserMeno":"1"
      }
      this.httpService.putHttp("/csysuser", pData).subscribe((data: any) => {
        this.msg.success("修改成功");
        this.isVisible = false;
        this.password1 = null;
        this.password2 = null;
        this.oldPassword = null;
        this.userService.purgeAuth();
        //清理reuse
        this.reuseTabService.clear();
        this.router.navigateByUrl("/login");
        this.isVisible = false;
      })
    }
  }
  //点击
  resetting(): void {
    this.tabView = true;
    this.isVisible = true;
    this.nzTitle = "修改密码";
    this.userid = this.userService.getCurrentUser()['csysUserId'];
    this.oldPassword1 = this.userService.getCurrentUser()['csysUserPassword'];
    this.handImg = this.userService.cyhttp + this.userService.getCurrentUser()['csysUserHeadimage'];

  }
  resetPassword(): void {
    this.tabView = true;
    this.isVisible = true;
    this.nzTitle = "您的账户存在安全问题，请及时修改密码！";
    this.userid = this.userService.getCurrentUser()['csysUserId'];
    this.oldPassword1 = this.userService.getCurrentUser()['csysUserPassword'];
    this.handImg = this.userService.cyhttp + this.userService.getCurrentUser()['csysUserHeadimage'];

  }
  confirm(): void {
    this.confirmPd = true;
    if (this.password1 == this.password2) {
      this.confirmPd = false;
    }
  }
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [
    // {
    //   uid: -1,
    //   name: '头像',
    //   status: 'done',
    //   url: environment.RESOURCE_SERVER_URL + "photofiles/20191015025738789-1-1405161AK3[1] - 副本.jpg"
    // }
  ];
  imageUrl;
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };
  onloading = false;
  avatarUrl: string;


  beforeUpload = (file: File) => {
    console.log(file);
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      const isJPG1 = file.type === 'image/png';
      if (!isJPG) {
        console.log(file);
        if (!isJPG1) {
          this.msg.error('图片必需是jpg货这png格式!');
          observer.complete();
          return;
        }
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.msg.error('图片必需小于5MB!');
        observer.complete();
        return;
      }
      // check height
      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('Image only 300x300 above');
          observer.complete();
          return;
        }

        observer.next((isJPG || isJPG1) && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image(); // create image
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width >= 100 && height >= 100);
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    console.log("fileListinfo", info);
    //this.imageUrl = this.fileList[0].response[0].fileUrl;
    // this.imageUrl = info.fileList[0].response[0].fileUrl;
    console.log("fifileUrlleList", this.fileList);
    switch (info.file.status) {
      case 'uploading':
        this.onloading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.onloading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.onloading = false;
        break;
    }
  }
  headImgChange(): void {

  }

  getUserStatus() {

    if(null!=this.userService.getCurrentUser()){
      if (this.userService.getCurrentUser()['csysUserMeno'] == "0") {
        this.resetPassword();
      }
    }
    

  }
}
