import { Directive, Output, EventEmitter, ElementRef, AfterViewInit, Input } from '@angular/core';
import { root } from 'rxjs/internal-compatibility';

@Directive({
  selector: '[ryDomVisible]'
})
export class DomVisibleDirective implements AfterViewInit {
  @Input() visibleUsed = true;
  @Input() root: any;
  @Output() visible: EventEmitter<{ visible: boolean, time: number }> = new EventEmitter();

  private _intersectionObserver: IntersectionObserver;
  private alreadyShow = false;
  private timer;

  constructor(
    private _elemRef: ElementRef
  ) { }

  ngAfterViewInit() {
    let opt:any= {
      threshold: 0.95,
    }
    // if(root) opt.root=document.getElementById('tableSMT');
    if (this.visibleUsed) {
      this._intersectionObserver = new IntersectionObserver(entries => {
        this._checkForIntersection(entries);
      },opt);
      this._intersectionObserver.observe(<Element>this._elemRef.nativeElement);
    }

  }

  private _checkForIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      this.visible.emit({ visible: entry.isIntersecting, time: entry.time });
      // if (entry.isIntersecting) {
      //   this._intersectionObserver.unobserve(this._elemRef.nativeElement);
      //   this._intersectionObserver.disconnect();
      //   this.timer = null;
      // }
    });
  }

  private _checkIfIntersecting(entry: IntersectionObserverEntry) {
    return (<any>entry).isIntersecting;
  }

}
