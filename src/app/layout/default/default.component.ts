
import {
  Component,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Inject,
  TemplateRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { updateHostClass } from '@delon/util';
import { SettingsService } from '@delon/theme';
import { LayoutService, SetService } from 'ngx-block-core';
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component';
import { environment } from '@env/environment';
 

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
})
export class LayoutDefaultComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @ViewChild('settingHost', { read: ViewContainerRef,static:false })
  @ViewChild('template',{static:false})
  tplRef: TemplateRef<any>;
  private settingHost: ViewContainerRef;
  isFetching = false;
  releaseData;
  placement = 'topRight';
  versiontimer: any;

  links = [
    {
      title: '帮助',
      href: ''
    },
    {
      title: '隐私',
      href: ''
    },
    {
      title: '条款',
      href: ''
    }
  ];
  isVisible = false;
  constructor(
    private router: Router,
    _message: NzMessageService,
    private resolver: ComponentFactoryResolver,
    private settings: SettingsService,
    private el: ElementRef,
    private renderer: Renderer2,
    public layoutService: LayoutService,
    public setService: SetService,
    private notification: NzNotificationService,
    @Inject(DOCUMENT) private doc: any,
  ) {
    // scroll to top in change page
    router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        }
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
        this.isFetching = false;
      }, 100);
    });
    
  }
 
  private setClass() {
    const { el, doc, renderer, settings } = this;
    const layout = settings.layout;
    updateHostClass(
      el.nativeElement,
      renderer,
      {
        ['alain-default']: true,
        [`alain-default__fixed`]: layout.fixed,
        [`alain-default__collapsed`]: layout.collapsed,
      },
    );

    doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak');
  }

  ngAfterViewInit(): void {
    // Setting componet for only developer
    if (!environment.production) {
      setTimeout(() => {
        const settingFactory = this.resolver.resolveComponentFactory(SettingDrawerComponent);
        this.settingHost.createComponent(settingFactory);
      }, 22);
    }
  }

  ngOnInit() {
    const { settings, unsubscribe$ } = this;
    settings.notify.pipe(takeUntil(unsubscribe$)).subscribe(() => this.setClass());
    this.setClass();
    if (typeof this.setService.pageDatas['needNextCheckBoxValue'] == "undefined") {
      this.setService.pageDatas['needNextCheckBoxValue'] = false;
    }

  }

  handleCancel(): void {

    this.router.navigate(['/default/pages', { outlets: { modal: null } }]);
    this.router.navigateByUrl(this.layoutService.nzRoutePath);
    this.layoutService.isVisible = false;
  }
  handleAfterClose(): void {

    if (this.layoutService.nzRoutePath != null && this.layoutService.nzRoutePath != "") {
      this.router.navigate(['/default/pages', { outlets: { modal: null } }]);
      this.router.navigateByUrl(this.layoutService.nzRoutePath);
    }

    console.log("table_modal", this.setService.pageDatas['table_modal']);
    //延时 防止路由串参数 
    setTimeout(() => {
      //查看是否需要执行额外事件
      if (typeof this.setService.pageDatas['table_modal'] != 'undefined') {

        //判断是否需要刷新
        if (this.setService.pageDatas['table_modal']['isNeedRefresh'] && this.setService.pageDatas['table_modal']['blockid'] != "") {
          this.setService.sendEvent(this.setService.pageDatas['table_modal']['blockid'], "simpleSearch", {
            reset: false
          })
        }

      }
      delete this.setService.pageDatas['table_modal'];

      this.layoutService.nzRoutePath = "";
    }, 50);

  }

  

  ngOnDestroy() {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
  }
  //
  checked = false;
  changeNeedNextCheckBox(value) {
    this.setService.pageDatas['needNextCheckBoxValue'] = value
  }
}
