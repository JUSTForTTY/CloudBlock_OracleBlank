import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proline-errormsg',
  templateUrl: './proline-errormsg.component.html',
  styleUrls: ['./proline-errormsg.component.less']
})
export class ProlineErrormsgComponent implements OnInit {
loading = false;
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
  constructor() { }

  ngOnInit() {
  }

}
