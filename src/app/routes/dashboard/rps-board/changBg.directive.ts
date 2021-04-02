import { Directive, ElementRef, HostListener, Input, AfterViewInit, OnDestroy } from '@angular/core';
@Directive({
  selector: '[ryChangBg]'
})
export class ChangeBgDirective implements AfterViewInit, OnDestroy {

  constructor(private el: ElementRef) { }



  @Input() defaultColor: string;
  @Input() changeColor: string;


  @Input('ryHighlight') highlightColor: string;
  @Input() highlightType: 'error' | 'warning' | 'success' = 'success';
  private timer

  ngAfterViewInit(): void {
    if (!this.defaultColor) {
      this.defaultColor = this.el.nativeElement.style.backgroundColor || this.el.nativeElement.style.background || 'unset';
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    const colors = [this.defaultColor]
    switch (this.highlightType) {
      case 'error':
        this.changeColor = "rgb(245, 34, 45)";
        colors.push(this.changeColor);

        break;
      case 'warning':
        this.changeColor = "#c2af04";
        colors.push(this.changeColor);

        break;

      default:
        break;
    }
    if (colors.length === 1) return;
    let index = 1
    this.timer = setInterval(() => {
      this.highlight(colors[index % 2])
      index++;
    }, 500)

  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }


  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}