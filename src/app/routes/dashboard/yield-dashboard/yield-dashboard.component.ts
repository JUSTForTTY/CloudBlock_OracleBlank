
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
 
@Component({
  selector: 'app-yield-dashboard',
  templateUrl: './yield-dashboard.component.html',
  styleUrls: ['./yield-dashboard.component.less']
})
export class YieldDashboardComponent implements OnInit, OnDestroy {
 
  constructor(private cdr: ChangeDetectorRef) { }
  
  ngOnInit() {


  }

  ngOnDestroy(): void {

  }
}
