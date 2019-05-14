import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { UserService } from '@core';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  constructor(public settings: SettingsService,public userService:UserService) {}


  ngOnInit() {
     
    console.log("天天",this.userService.getCurrentUser()['csysUserRealname'])

  }
}
 