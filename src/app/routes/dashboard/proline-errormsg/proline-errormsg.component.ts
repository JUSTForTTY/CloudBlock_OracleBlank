import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpService, PageService } from 'ngx-block-core';

@Component({
  selector: 'app-proline-errormsg',
  templateUrl: './proline-errormsg.component.html',
  styleUrls: ['./proline-errormsg.component.less']
})
export class ProlineErrormsgComponent implements OnInit, OnDestroy {
  @Input() prolineCode;
  
  loading = false;
  prolineErrorData = [];
  data = [
    {
      title: '产线异常信息 1'
    },
    {
      title: '产线异常信息 2'
    },
    {
      title: '产线异常信息 3'
    },
    {
      title: '产线异常信息 4'
    },
    {
      title: '产线异常信息 5'
    }
  ];
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getErrorData();
  }

  //获取产线异常信息
  getErrorData() {


    this.httpService.getHttp("/yieldDashboard/errorData/" + this.prolineCode).subscribe((errorData: any) => {

      console.log("产线报表-异常信息产线", errorData);
      this.prolineErrorData = errorData.data;
      console.log("产线报表-异常信息", this.prolineErrorData);
      

    });

  }

  ngOnDestroy(): void {
  


  }

}
