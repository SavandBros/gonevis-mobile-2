import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WriteModalComponent } from './write-modal.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WriteModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  entryComponents: [WriteModalComponent]
})
export class WriteModalModule {
}
