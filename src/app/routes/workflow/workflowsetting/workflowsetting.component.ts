import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'workflowsetting',
  templateUrl: './workflowsetting.component.html',
  styleUrls: ['./workflowsetting.component.less']
})
export class WorkflowsettingComponent implements OnInit {
  array = [ 1, 2, 3, 4 ];
  constructor() { }

  ngOnInit() {
  }

}
