import { Component, OnInit } from '@angular/core';
import { RpsBoardService } from '../../../rps-board/rps-board.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class SelectComponent implements OnInit {

  constructor(public rpsBoardService: RpsBoardService, private router: Router) { }

  ngOnInit() {
  }
  onClick(code) {
    this.router.navigate(['/fullscreen/dashboard/rpsboard-mobile/v1'], { queryParams: { workshopCode: code } });
  }

}
