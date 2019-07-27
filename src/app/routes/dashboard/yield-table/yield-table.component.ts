import { Component, OnInit } from '@angular/core';
import { HttpService } from 'ngx-block-core';

@Component({
  selector: 'app-yield-table',
  templateUrl: './yield-table.component.html',
  styleUrls: ['./yield-table.component.less']
})
export class YieldTableComponent implements OnInit {
  dataSet = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
  constructor(private httpService: HttpService) { }

  ngOnInit() {





  }

  getYieldData() {
    let bodyData = { "tableColumn": [],
     "tableName": "T_TEST001", 
     "pageSize": 8, 
     "nowPage": 1, 
     "tableSort": [], 
     "searchMap": {},
     "deleteFlag": [{ "name": "T_TEST001_FLAG", "value": "0" }], "engineMap": {} }

    this.httpService.postHttp("/yieldDashboard/tableData", bodyData).subscribe((data: any) => {
      

    })

  }

}
