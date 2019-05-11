import { Component, OnInit } from '@angular/core';
import { JwtService } from 'ngx-block-core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.less']
})
export class AuthLoginComponent implements OnInit {

  constructor(private jwtService: JwtService, private activatedRoute: ActivatedRoute, private router: Router,private userService: UserService) { }

  userId: string;;
  userName: string;
  authOpenid: string;
  redirect_uri: string;
  currentAuthOpenid: string;


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.userId = queryParams['userId'];
      this.userName = queryParams['userName'];
      this.authOpenid = queryParams['authOpenid'];
      this.redirect_uri = queryParams['redirect_uri'];
    });


    if (this.checkAuthOpenid()) {
      //进行登录操作
      let params = {
        "csysUserOpenId": this.authOpenid

      }
      this.userService.attemptAuth(params).subscribe(
        (data: any) => {
          setTimeout(() => {
            this.router.navigate([this.redirect_uri]);
          }, 3000);

        }, (err) => {

        });



    }

  }

  //获取统一授权码
  checkAuthOpenid() {

    this.currentAuthOpenid = this.jwtService.getUnionToken();

    //校验token码是否和授权对象一致
    if (this.authOpenid == this.currentAuthOpenid) {

      return true;
    } else {

      return false;
    }




  }



}
