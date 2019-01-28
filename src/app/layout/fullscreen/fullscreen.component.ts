import { Component } from '@angular/core';
import {
  Router
} from '@angular/router';
import { LayoutService } from 'ngx-block-core';
@Component({
  selector: 'layout-fullscreen',
  templateUrl: './fullscreen.component.html',
  host: {
    '[class.alain-fullscreen]': 'true',
  },
})
export class LayoutFullScreenComponent {
  constructor(public layoutService: LayoutService, private router: Router
    ) {}

    handleCancel(): void {
      this.router.navigate(['/default/pages',{ outlets: { modal: null }}]);
      this.layoutService.isVisible = false;
    }
   
}
