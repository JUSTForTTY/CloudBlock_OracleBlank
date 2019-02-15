import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService, JwtService, User } from 'ngx-block-core';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '@env/environment';
import { CacheService } from '@delon/cache';
import { MenuService } from '@delon/theme';
import { ACLService } from '@delon/acl';


const aclhttpurl = "" + environment.SERVER_URL + "/csysuserrole/condition";
const server_name = environment.SERVER_NAME;

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private httpService: HttpService,
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private menuService: MenuService,
    private aclService: ACLService,
    private cacheService: CacheService,
    private router: Router,
  ) { }

  cyhttp = environment.SERVER_URL;
  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info

    if (this.jwtService.getToken(server_name)['refresh_token']) {
      let credentials = {
        csysUserRefreshToken: this.jwtService.getToken(server_name)['refresh_token']
      }
      console.log("原始数据", credentials)
      this.httpService.postHttpAllUrl(this.cyhttp + '/csysuser/condition', credentials)
        .subscribe(
          (data: any) => {

            if (data.data.length > 0) {

              console.log("存在用户，无需重新登录", data.data);
              this.setAuth(data.data[0])
               
              this.loadMenu(data.data[0]).subscribe(
                (data: any) => {
                    
                });

            } else {
              console.log("去除用户");
              this.purgeAuth()
            }
          }, (err) => {
            console.log("去除用户");
            this.purgeAuth();

          }
        );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(server_name, user.csysUserAccessToken, user.csysUserRefreshToken);

    this.cacheService.set('userdata' + server_name, user, { type: 's', expire: 24 * 60 * 60 });

  }

  purgeAuth() {
    console.log("清空token");
    // Remove JWT from localstorage
    this.jwtService.destroyToken(server_name);

    //this.cacheService.clear();

    this.cacheService.remove('userdata' + server_name);

    this.router.navigate(['/login']);


  }

  attemptAuth(credentials): Observable<User> {

    return this.httpService.postHttpAllUrl(this.cyhttp + '/v1/authlogin', credentials)
      .pipe(map(
        data => {
          this.setAuth(data.data);

          return data.data;
        }
      ));

  }

  getCurrentUser() {

    return this.cacheService.getNone('userdata' + server_name);
  }


  loadMenu(user): Observable<boolean> {

    console.log("用户编号",user.csysUserId)
    let aclparams = {
      "csysUserId": user.csysUserId
    }

    return this.httpService.postHttpAllUrl(this.cyhttp + '/csysmenuauthview/tree', aclparams)
      .pipe(map(
        data => {
          console.log("菜单数据", data.data)

          data.data.unshift({
            text: '控制台',
            icon: 'fa fa-home',
            link: '/default/workplace',
        });
          this.menuService.add([
            {
              text: '利华Mes系统-东南大学',
              group: true,
              children: data.data
            }]);

          return true;
        }
      ));



  }
  // Update the user on the server (email, pass, etc)
  // update(user): Observable<User> {
  //   return this.apiService
  //   .put('/user', { user })
  //   .pipe(map(data => {
  //     // Update the currentUser observable
  //     this.currentUserSubject.next(data.user);
  //     return data.user;
  //   }));
  // }


  autoLogin() {

    if (this.jwtService.getToken(server_name)['refresh_token']) {
      let credentials = {
        csysUserRefreshToken: this.jwtService.getToken(server_name)['refresh_token']
      }
      console.log("原始数据", credentials)
      this.httpService.postHttpAllUrl(this.cyhttp + '/csysuser/condition', credentials)
        .subscribe(
          (data: any) => {

            if (data.data.length > 0) {

              console.log("存在用户，无需重新登录", data.data);
              this.setAuth(data.data[0])
              this.loadMenu(data.data[0]).subscribe(
                (data: any) => {
                    
                });

              //跳转路由
              this.router.navigate(['/default/workplace']);
            } else {
              console.log("去除用户");
              this.purgeAuth()

            }
          }, (err) => {
            console.log("去除用户");
            this.purgeAuth();


          }
        );

    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();

    }
  }
}
