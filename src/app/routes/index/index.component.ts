import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from 'ngx-block-core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls:[`./index.component.less`]
  
})
export class IndexComponent implements OnInit {
  projecturl="/v1/project";

  projectName:string;
  constructor(private msg: NzMessageService,private httpService: HttpService,private fb: FormBuilder,private route: ActivatedRoute) {
        
  }

   ngOnInit(){

     this.getData((res: any) =>{
      this.projectName = res.data[0].cySysProjectName;
      console.log(res);
        });
   }

   getData(callback: (res: any) => void): void {
    this.httpService.getHttp(this.projecturl).subscribe(
      (res: any) => (callback(res)));
  }
}
