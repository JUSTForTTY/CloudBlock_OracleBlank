import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[ryHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef) { }

  @Input() defaultColor: string;

  @Input('ryHighlight') highlightColor: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultColor || 'rgba(255, 0, 0, 0.15)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    if(this.el.nativeElement.children){
      for (const iterator of this.el.nativeElement.children) {
        iterator.style.backgroundColor = color;
      }
    }
    this.el.nativeElement.style.backgroundColor = color;
  }
}