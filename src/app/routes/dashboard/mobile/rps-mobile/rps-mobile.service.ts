import { Injectable } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class RpsMobileService {
  workshopCode='';
  workshops=[]
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
