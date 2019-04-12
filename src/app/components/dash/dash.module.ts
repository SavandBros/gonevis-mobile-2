import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { DashComponent } from './dash.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [{
  path: '',
  component: DashComponent,
  children: [{
    path: 'posts',
    loadChildren: './entries/entries.module#EntriesModule',
    data: {
      isPage: false
    }
  }, {
    path: 'pages',
    loadChildren: './entries/entries.module#EntriesModule',
    data: {
      isPage: true
    }
  }, {
    path: 'write',
    loadChildren: './write/write.module#WriteModule'
  }, {
    path: 'write/:entryId',
    loadChildren: './write/write.module#WriteModule'
  }, {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  }]
}];

@NgModule({
  declarations: [DashComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
})
export class DashModule {
}
