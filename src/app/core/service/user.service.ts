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
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { of as observableOf } from 'rxjs';


const aclhttpurl = "" + environment.SERVER_URL + "/csysuserrole/condition";
const server_name = environment.SERVER_NAME;
const server_url = environment.SERVER_URL;
const resource_url = environment.RESOURCE_SERVER_URL;
const data_url = environment.DATA_SERVER_URL;

@Injectable()
export class UserService {
  HeadUrl = "";
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
    private reuseTabService: ReuseTabService,
  ) { }

  cyhttp = environment.SERVER_URL;
  resourceHttp = environment.RESOURCE_SERVER_URL;
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
            if(data.data.csysUserHeadimage){
              this.HeadUrl = environment.RESOURCE_SERVER_URL + data.data.csysUserHeadimage;
            }
            if (data.data.length > 0) {

              console.log("存在用户，无需重新登录", data.data);

              //清空reuseTabService;

              this.reuseTabService.clear();

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

    this.jwtService.saveUserServerData(server_name, server_url, resource_url, data_url);

    this.cacheService.set('userdata' + server_name, user, { type: 's', expire: 24 * 60 * 60 });

  }

  setAuthByServer(user,serverData) {
    // Save JWT sent from server in localstorage
    console.log("bug登录检测",server_name);
    console.log("bug登录检测-token",user);
    this.jwtService.saveToken(server_name, user.csysUserAccessToken, user.csysUserRefreshToken);
    
    this.jwtService.saveUserServerData(server_name, serverData.serverUrl, serverData.resourceUrl, data_url);

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

  attemptAuth(credentials,serverData): Observable<User> {

    return this.httpService.postHttpAllUrl(serverData.serverUrl + '/v1/authlogin', credentials)
      .pipe(map(
        data => {
          this.setAuthByServer(data.data,serverData);

          return data.data;
        }
      ));

  }

  getCurrentUser() {
    return this.cacheService.getNone('userdata' + server_name);
  }


  loadMenu(user): Observable<boolean> {

    if (user != null) {
      console.log("用户编号", user)
      let aclparams = {
        "csysUserId": user.csysUserId
      }

      return this.httpService.postHttpAllUrl(this.cyhttp + '/csysmenuauthview/tree', aclparams)
        .pipe(map(
          data => {
            let menuData = data.data;

            const myObservable = observableOf(1);
            const addPage = {
              next: x => {
                this.httpService.postHttpAllUrl(this.cyhttp + '/csyssimplepage/condition', { csysPageType: 1 }).subscribe(
                  (pagedata: any) => {
                    let pageData = []
                    console.log("内置页面-未组装数据加载完毕2", pagedata, JSON.stringify(pagedata));
                    pagedata.data.forEach(element => {

                      pageData.push(
                        {
                          text: element['csysPageName'],
                          link: element['csysPageRouthPath'],
                        }
                      )
                      console.log("link", element['csysPageRouthPath'])
                    });
                    let serverPage = [
                      {
                        text: "途程图",
                        link: "/default/pages/workflow/flowchart"
                      },
                      {
                        text: "组织变更",
                        link: "/default/pages/authority/organizationalchart"
                      }
                    ]
                    menuData.push(
                      {
                        text: '内置页面',
                        group: true,
                        hide: true,
                        children: pageData
                      },
                      {
                        text: '内置页面',
                        group: true,
                        hide: true,
                        children: serverPage
                      }
                    )
                    console.log("菜单数据", menuData)

                    this.menuService.add([
                      {
                        text: '利华生产系统',
                        group: true,
                        children: menuData
                      }]);
                    console.log("菜单数据23", this.menuService, this.menuService.menus)



                    // this.menuService.add([
                    //   {
                    //     text: '内置页面',
                    //     group: true,
                    //     children: pageData
                    //   }]);



                  });

              },
            };





            menuData.forEach(element => {
              if (element.children.length > 0) {

                element.children.forEach(childrenElement => {
                  if (childrenElement.csysMenuIsOutline == 2) {
                    console.log("子流程外部链接")
                    childrenElement.externalLink = childrenElement.link
                  }

                });


              } else {
                if (element.csysMenuIsOutline == 2) {
                  console.log("外部链接")
                  element['externalLink'] = element.link
                }
              }


            });

            console.log("菜单数据", menuData)

            menuData.unshift({
              text: '控制台',
              icon: 'fa fa-home',
              link: '/default/workplace',
            });



            myObservable.subscribe(addPage);

            return true;
          }
        ));
    } else {


    }

  }

  loadMenuByServer(user,serverData): Observable<boolean> {

    if (user != null) {
      console.log("用户编号", user)
      let aclparams = {
        "csysUserId": user.csysUserId
      }

      return this.httpService.postHttpAllUrl(serverData.serverUrl + '/csysmenuauthview/tree', aclparams)
        .pipe(map(
          data => {
            let menuData = data.data;

            const myObservable = observableOf(1);
            const addPage = {
              next: x => {
                this.httpService.postHttpAllUrl(serverData.serverUrl + '/csyssimplepage/condition', { csysPageType: 1 }).subscribe(
                  (pagedata: any) => {
                    let pageData = []
                    console.log("内置页面-未组装数据加载完毕2", pagedata, JSON.stringify(pagedata));
                    pagedata.data.forEach(element => {

                      pageData.push(
                        {
                          text: element['csysPageName'],
                          link: element['csysPageRouthPath'],
                        }
                      )
                      console.log("link", element['csysPageRouthPath'])
                    });
                    let serverPage = [
                      {
                        text: "途程图",
                        link: "/default/pages/workflow/flowchart"
                      },
                      {
                        text: "组织变更",
                        link: "/default/pages/authority/organizationalchart"
                      }
                    ]
                    menuData.push(
                      {
                        text: '内置页面',
                        group: true,
                        hide: true,
                        children: pageData
                      },
                      {
                        text: '内置页面',
                        group: true,
                        hide: true,
                        children: serverPage
                      }
                    )
                    console.log("菜单数据", menuData)

                    this.menuService.add([
                      {
                        text: '利华生产系统',
                        group: true,
                        children: menuData
                      }]);
                    console.log("菜单数据23", this.menuService, this.menuService.menus)



                    // this.menuService.add([
                    //   {
                    //     text: '内置页面',
                    //     group: true,
                    //     children: pageData
                    //   }]);



                  });

              },
            };





            menuData.forEach(element => {
              if (element.children.length > 0) {

                element.children.forEach(childrenElement => {
                  if (childrenElement.csysMenuIsOutline == 2) {
                    console.log("子流程外部链接")
                    childrenElement.externalLink = childrenElement.link
                  }

                });


              } else {
                if (element.csysMenuIsOutline == 2) {
                  console.log("外部链接")
                  element['externalLink'] = element.link
                }
              }


            });

            console.log("菜单数据", menuData)

            menuData.unshift({
              text: '控制台',
              icon: 'fa fa-home',
              link: '/default/workplace',
            });



            myObservable.subscribe(addPage);

            return true;
          }
        ));
    } else {


    }

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
