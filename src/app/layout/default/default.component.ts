
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
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { updateHostClass } from '@delon/util';
import { SettingsService } from '@delon/theme';
import { LayoutService,SetService } from 'ngx-block-core';
import { environment } from '@env/environment';
import { SettingDrawerComponent } from './setting-drawer/setting-drawer.component';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
})
export class LayoutDefaultComponent implements OnInit, AfterViewInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @ViewChild('settingHost', { read: ViewContainerRef })
  private settingHost: ViewContainerRef;
  isFetching = false;

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
    public layoutService:LayoutService,

    public setService: SetService,
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

  }

  handleCancel(): void {
    console.log("关闭弹窗方法");
    this.router.navigate(['/default/pages',{ outlets: { modal: null }}]);
    this.layoutService.isVisible = false;
  }
  handleAfterClose(): void {

    console.log("弹窗已经完全关闭");

    console.log("table_modal", this.setService.pageDatas['table_modal']);
    //查看是否需要执行额外事件
    if (typeof this.setService.pageDatas['table_modal'] != 'undefined') {

      console.log("查询数据")
      //判断是否需要刷新
      if(this.setService.pageDatas['table_modal']['isNeedRefresh']){
        this.setService.sendEvent(this.setService.pageDatas['table_modal']['blockid'], "simpleSearch")
      }

    }
    delete this.setService.pageDatas['table_modal'];


  }
  ngOnDestroy() {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
  }
  //
  checked=false;
  changeNeedNextCheckBox(value){
    this.setService.pageDatas['needNextCheckBoxValue']=value
  }
}
