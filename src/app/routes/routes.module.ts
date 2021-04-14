import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
// passport pages
// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { IndexComponent } from './index/index.component';



@NgModule({
    imports: [ SharedModule, RouteRoutingModule ],
    declarations: [
        // passport pages
        // single pages
        CallbackComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component,
        IndexComponent,
     
    ]
})
export class RoutesModule {}
