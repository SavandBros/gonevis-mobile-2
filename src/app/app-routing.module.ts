import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { AnonymousGuardService } from './services/anonymous-guard/anonymous-guard.service';

const routes: Routes = [{
  path: 'dash',
  loadChildren: './components/dash/dash.module#DashModule',
  canActivate: [AuthGuardService]
}, {
  path: 'login',
  loadChildren: './components/login/login.module#LoginModule',
  canActivate: [AnonymousGuardService]
}, {
  path: '',
  redirectTo: 'login',
  pathMatch: 'full'
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
