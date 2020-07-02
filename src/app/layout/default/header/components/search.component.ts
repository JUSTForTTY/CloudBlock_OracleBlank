import {
  Component,
  HostBinding,
  Input,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { MenuService } from '@delon/theme';

@Component({
  selector: 'header-search',
  template: `
  <nz-input-group [nzAddOnBeforeIcon]="focus ? 'anticon anticon-arrow-down' : 'anticon anticon-search'">
    <input nz-input [(ngModel)]="q" (focus)="qFocus()" (ngModelChange)="change()" (blur)="qBlur()"
      [placeholder]="'menu.search.placeholder' | translate">
  </nz-input-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderSearchComponent implements AfterViewInit,OnInit {
  ngOnInit(): void {
    this.menuData = this.menuService.menus;
    console.log("menu",this.menuData)
  }
  q: string;

  qIpt: HTMLInputElement;

  @HostBinding('class.alain-default__search-focus')
  focus = false;

  @HostBinding('class.alain-default__search-toggled')
  searchToggled = false;

  @Input()
  set toggleChange(value: boolean) {
    if (typeof value === 'undefined') return;
    this.searchToggled = true;
    this.focus = true;
    setTimeout(() => this.qIpt.focus(), 300);
  }

  constructor(private el: ElementRef,private menuService: MenuService,) {}
  menuData;
  ngAfterViewInit() {
    this.qIpt = (this.el.nativeElement as HTMLElement).querySelector('.ant-input');
    
   
  }

  qFocus() {
    this.focus = true;
  }

  qBlur() {
    this.focus = false;
    this.searchToggled = false;
  }
  change():void{
 
    if(!this.q){
      this.menuService.add([
        {
          text: '利华生产系统',
          group: true,
          children: this.menuData
        }]);
    }
  }
}
