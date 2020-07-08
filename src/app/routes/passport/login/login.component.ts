import { SettingsService, TitleService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { HttpService, JwtService } from 'ngx-block-core';
import { UserService } from './../../../core/service/user.service';
import { CacheService } from '@delon/cache';
import { Observable, Observer } from 'rxjs';
import { environment } from '@env/environment';
import { MenuService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { HttpClient } from '@angular/common/http';


const aclhttpurl = "" + environment.SERVER_URL + "/cysysbaseuserrole/condition";
const userinfourl = environment.SERVER_URL + "/cysysbaseuser/checkMobile";
const getcodeurl = environment.SERVER_URL + "/system/postMessage";
const server_name = environment.SERVER_NAME

@Component({
    selector: 'tty-init',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService]
})
export class UserLoginComponent implements OnDestroy, OnInit, AfterContentInit {

    form: FormGroup;
    isSpinning = false;
    error = '';
    type = 0;
    loading = false;
    realcaptcha = "";
    constructor(
        private cacheService: CacheService,
        private httpService: HttpService,
        private userService: UserService,
        private jwtService: JwtService,
        private titleService: TitleService,
        private menuService: MenuService,
        private aclService: ACLService,
        private httpClient: HttpClient,
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private settingsService: SettingsService,
        private socialService: SocialService,

        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.form = fb.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            // mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)], [this.mobilesyncValidator]],
            // captcha: [null, [Validators.required], [this.captchasyncValidator]],
            remember: [true]
        });

    }

    ngOnInit() {

        //console.log("自动登录", this.jwtService.getToken(server_name)['access_token'])
        //检测token是否为空，不为空，自动登录
        //this.userService.autoLogin();

    }
    ngAfterContentInit() {

    }

    // region: fields
    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }


    //验证码校验
    captchasyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
        setTimeout(() => {
            if (control.value !== this.realcaptcha) {
                observer.next({ error: true, same: true });
            } else {
                observer.next(null);
            }
            observer.complete();
        }, 1000);
    });

    //手机号存在校验
    mobilesyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
        //查询手机号是否存在
        let params = {
            "cySysBaseUserMobile": control.value
        }

        this.httpService.postHttpAllUrl(userinfourl, params).subscribe((data: any) => {

            console.log(data)
            observer.next(null);
            observer.complete();
        }, error => {

            observer.next({ error: true, same: true });
            observer.complete();

        });

    });

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.form.controls.mobile.markAsDirty();
        if (this.mobile.invalid) return;

        let data = this.form.value;
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
        //获取验证码

        let code = ""; //验证码
        let codeLength = 6;//验证码长度
        //产生验证码
        for (let i = 0; i < codeLength; i++) {
            code += Math.floor(Math.random() * 10);
        }
        this.realcaptcha = code;
        let params = {
            "mobile": data.mobile,
            "content": "动态密码" + code + "(请勿告知他人),该验证码用于云积木注册或登录,10分钟有效【苏州创游信息科技有限公司】"
        }

        this.httpService.postHttpAllUrl(getcodeurl, params).subscribe((data: any) => {



            this.msg.create("success", `发送成功！`);

        });

    }

    // endregion

    goPages = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            this.submit();
        } else {


        }
        event.preventDefault();
    };

    submit() {
        let checkparams = {
            "csysUserUsername": this.userName.value.toLowerCase(),
            "csysUserPassword": this.password.value
        }
        //自动识别空闲服务器
        this.httpService.postHttp("/v1/checkServer", checkparams).subscribe((serverData: any) => {

            console.log("识别空闲服务器",serverData);
            this.autoLogin(serverData.data);
      
          }, (err) => {
            console.log("识别空闲服务器-接口异常");
      
          });
 
    }

    autoLogin(serverData){
        this.error = '';
        let params = {};
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return;
            //账户不需要大小写区分（特殊处理）
            params = {
                "csysUserUsername": this.userName.value.toLowerCase(),
                "csysUserPassword": this.password.value,
                "csysUserAddress":serverData.homeUrl
            }
        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid || this.captcha.invalid) return;
            if (this.captcha.invalid || this.captcha.value != this.realcaptcha) return;

            params = {
                "csysUserMobile": this.mobile.value
            }
        }

        this.loading = true;

        this.userService.attemptAuth(params,serverData).subscribe(
            (data: any) => {

                this.userService.loadMenuByServer(data,serverData).subscribe(
                    (data: any) => {
                        this.router.navigate(['/default/workplace']);
                    });
 

            }, (err) => {
                this.loading = false;
                let errstr = err + "";
                if (errstr.indexOf("400") >= 0) {
                    this.error = `账户或密码错误`;
                    return;

                } else {
                    this.error = '接口异常';
                    return;
                }

            });
    }

    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
