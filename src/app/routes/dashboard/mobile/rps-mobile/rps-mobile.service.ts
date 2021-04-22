import { Injectable } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WorkShop } from '../../rps-board/rps-board.service';

@Injectable()
export class RpsMobileService {
  workshopCode='';
  workshops=[]
  // workShop: WorkShop

  changeWorkshop$: Subject<string> = new Subject();

  constructor(private http: HttpService,) { 
    // this.http.postHttp('/workshop/condition', {  }).subscribe(
    //   (data: {
    //     data: any
    //   }) => {
    //     console.log('workshop', data)  
    //   }
    // )
  }
}
