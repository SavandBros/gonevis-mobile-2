import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WriteComponent } from './write.component';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';

const routes: Routes = [{
  path: '',
  component: WriteComponent
}];

@NgModule({
  declarations: [WriteComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AutosizeModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike', 'underline'],
          ['link', { 'list': 'bullet' }, { 'align': [] }],
          [{ 'header': [1, 2, 3, false]}]
        ]
      },
      theme: 'bubble'
    }),
    RouterModule.forChild(routes)
  ]
})
export class WriteModule {
}
