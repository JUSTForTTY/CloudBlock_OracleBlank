import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardWorkplaceComponent } from './workplace/workplace.component';

// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { AuthLoginComponent } from './passport/auth-login/auth-login.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

import { IndexComponent } from './index/index.component';

const routes: Routes = [
    {
        path: 'default',
        component: LayoutDefaultComponent,
        children: [
            { path: 'workplace', component: DashboardWorkplaceComponent, data: { title: '控制台' } },
            { path: 'pages', loadChildren: './pages/pages.module#PagesModule' }//test测试页面
            // 业务子模块
            // { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' }
        ]
    },
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            { path: '', component: DashboardWorkplaceComponent, data: { title: '控制台' } }


        ]
    },
    //工作流
    {
        path: 'workflow', loadChildren: './workflow/workflow.module#WorkflowModule', data: { title: '工作流' },
        component: LayoutDefaultComponent,

    },
    //组织权限
    {

        path: 'authority', loadChildren: './organizational/organizational.module#OrganizationalModule', data: { title: '组织权限' },
        component: LayoutDefaultComponent,

    },
    // 全屏布局
    {
        path: 'fullscreen',
        component: LayoutFullScreenComponent,
        children: [
            { path: 'default/pages', loadChildren: './pages/pages.module#PagesModule' },
            { path: 'auth-login', component: AuthLoginComponent, data: { title: '授权登录' } }
        ]
    },

    // passport
    {
        path: '',
        component: LayoutPassportComponent,
        children: [
            //{ path: '', redirectTo: 'login',pathMatch:'full' },
            { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
            { path: 'register', component: UserRegisterComponent },
            { path: 'register-result', component: UserRegisterResultComponent }
        ]
    },
    // 单页不包裹Layout
    { path: 'callback/:type', component: CallbackComponent },
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: 'dashboard' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
    exports: [RouterModule]
})
export class RouteRoutingModule { }
