import { Injectable } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';

@Injectable()
export class RpsMobileService {
  workshopCode='';
  workshops=[]
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
