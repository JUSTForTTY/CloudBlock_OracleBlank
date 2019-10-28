import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponseBase, HttpResponse, HttpEvent,
} from '@angular/common/http';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { HttpService, JwtService } from 'ngx-block-core';
import { CacheService } from '@delon/cache';
import { UserService } from './../service/user.service';

const loginHttpUrl = environment.SERVER_URL + "/v1/authlogin";
const registerHttpUrl = environment.SERVER_URL + "/cloudblock/v1/register";
const getCodeHttpUrl = environment.SERVER_URL + "/system/postMessage";
const checkmobileHttpUrl = environment.SERVER_URL + "/cysysbaseuser/checkMobile";

const server_name = environment.SERVER_NAME

const CODEMESSAGE = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private cacheService: CacheService, private settingService: SettingsService, private notification: NzNotificationService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private httpService: HttpService, private jwtService: JwtService,private userService:UserService ,private router: Router) { }
 
    get msg(): NzMessageService {
        return this.injector.get(NzMessageService);
    }

    private goTo(url: string) {
        setTimeout(() => this.injector.get(Router).navigateByUrl(url));
    }

    private checkStatus(ev: HttpResponseBase) {
        if (ev.status >= 200 && ev.status < 300) return;

        const errortext = CODEMESSAGE[ev.status] || ev.statusText;
        this.injector.get(NzNotificationService).error(
            `请求错误 ${ev.status}: ${ev.url}`,
            errortext
        );
    }
    private handleData(ev: HttpResponseBase): Observable<any> {
        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        if (ev.status > 0) {
            this.injector.get(_HttpClient).end();
        }
        this.checkStatus(ev);
        // 业务处理：一些通用操作

        console.log("回调处理", ev);
        switch (ev.status) {
            case 200:
                const body: any = ev instanceof HttpResponse && ev.body;

                console.log("回调处理body", body.code)
                if (body.code == 401) {
                    this.notification.remove();
                    this.notification.create('warning', '系统提示',
                        '对不起，该账户已过期或者已在其他设备登录！');
                    this.userService.purgeAuth();
                    this.goTo('/login');

                }
                else if (body.code == 200) {

                    //更新token信息
                    if (body.param.access_token != undefined && body.param.refresh_token != undefined) {

                        this.jwtService.saveToken(server_name, body.param.access_token, body.param.refresh_token);
                    }
                } else if (body.code == 500) {

                    // this.notification.create('error', '系统提示',
                    //     '系统维护中，请稍后进行操作"。');
                    //更新token信息
                    if (body.param.access_token != undefined && body.param.refresh_token != undefined) {

                        this.jwtService.saveToken(server_name, body.param.access_token, body.param.refresh_token);
                    }
                    this.notification.remove();
                    this.notification.create('warning', '系统提示',
                    '对不起，系统正在维护或网络波动，请稍后再试！');
                    //this.goTo(`/${ev.status}`);
                }

                break;
            case 401: // 未登录状态码
                // 请求错误 401: https://preview.pro.ant.design/api/401 用户没有权限（令牌、用户名、密码错误）。
                (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
                this.goTo('/passport/login');
                break;
            case 403:
            case 404:
            case 500:
                this.goTo(`/${ev.status}`);
                break;
            default:
                if (ev instanceof HttpErrorResponse) {
                    console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起', ev);
                    // this.notification.create('error', '系统提示',
                    //     ev.message);
                    this.notification.remove();
                    this.notification.create('warning', '系统提示',
                    '对不起，系统正在维护或网络波动，请稍后再试！');

                }
                break;
        }
        return of(ev);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {

        };

        const token = this.jwtService.getToken(server_name);

        if (token) {
            console.log("头部token", token);
            headersConfig['access_token'] = `${token['access_token']}`;
            headersConfig['refresh_token'] = `${token['refresh_token']}`;
        }

        console.log("headerconfig", headersConfig);
        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('assets/')) {
            url = environment.SERVER_URL + url;//本地api不做拦截

        }
        console.log("统一加上服务端前缀", url)
        let newReq;
        if (url != loginHttpUrl && url != getCodeHttpUrl && url != registerHttpUrl && url != checkmobileHttpUrl) {
            console.log("处理统一接口")
            // console.log(this.tokenService.get().token)
            // console.log(this.tokenService.get().refresh_token)
            if (this.jwtService.getToken(server_name)) {

                newReq = req.clone({
                    url: url,
                    setHeaders: headersConfig
                });

            } else {
                console.log("token不存在，返回登录")
                this.goTo('/login');
                console.log(newReq);
            }
        } else {
            newReq = req.clone({
                url: url
            });
        }

        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // 允许统一对请求错误处理
                if (event instanceof HttpResponseBase)
                    return this.handleData(event);
                // 若一切都正常，则后续操作
                return of(event);
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err)),
        );
    }
}