import { Component, OnInit } from '@angular/core';
import { RpsBoardService } from '../../../rps-board/rps-board.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class SelectComponent implements OnInit {

  constructor(public rpsBoardService:RpsBoardService) { }

  ngOnInit() {
  }

}
