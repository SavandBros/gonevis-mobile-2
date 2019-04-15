import { Component, ElementRef, HostListener } from '@angular/core';
import Entry from '../../../models/entry/entry';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EntryService } from '../../../services/entry/entry.service';
import './editor-config';
import { AuthService } from '../../../services/auth/auth.service';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WriteModalComponent } from '../write-modal/write-modal.component';
import { Extends } from '@angular-devkit/schematics/collection-schema';
import { Tag } from '../../../models/tag/tag';
import { ApiResponseService } from '../../../services/api-response/api-response.service';
import { EntryStatuses } from '../../../enums/entry_statuses/entry_statuses';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss'],
})
export class WriteComponent {
  // Platform back button subscription.
  backButtonSubscription: Subscription;
  // Instance of entry.
  entry: Entry = new Entry({ content: '', site: this.authService.blogValue.id });

  // Host listener which will listen to 'message' event.
  @HostListener('window:message', ['$event'])
  embedListeners(event: any): void {
    // Check if there is 'elementId' in event's 'data' property.
    if (event.data.elementId) {
      // Element with specific attribute.
      const element = this.elm.nativeElement.querySelector(`[data-embed-url='${event.data.elementId}']`);
      // Update element's 'height' style property.
      element.setAttribute('height', event.data.height + 'px');
    }
  }

  constructor(private route: ActivatedRoute, private router: Router,
              private elm: ElementRef, private platform: Platform,
              private modalController: ModalController, private alertController: AlertController,
              private entryService: EntryService, private authService: AuthService) {
    // Subscribe to platform's back button event.
    this.backButtonSubscription = this.platform.backButton.subscribe((): void => {
      this.goBack();
    });
  }

  /*
  * This function presents write modal.
  * */
  async writeModal(): Promise<HTMLIonModalElement> {
    const modal = await this.modalController.create({
      component: WriteModalComponent,
      componentProps: { entry: this.entry }
    });
    await modal.present();
    return modal;
  }

  /*
  * This function presents write modal and listens to it's dismiss callback.
  * */
  presentWriteModal(): void {
    // Present write modal.
    this.writeModal().then((modal: HTMLIonModalElement): void => {
      // Listen to write modal dismiss data.
      modal.onDidDismiss().then((data: { data: { entry: Entry }, role: string }): void => {
        // Update entry based on returned data.
        this.entry = data.data.entry;
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Ready to publish?',
      buttons: [{
        text: 'Not yet',
        cssClass: 'secondary',
        handler: () => {
          this.updateEntry(true);
        }
      }, {
        text: 'Publish',
        handler: () => {
          this.updateEntry();
        }
      }]
    });

    await alert.present();
  }

  /*
  * This function will save post as draft and navigates to 'posts' route.
  * */
  goBack(): void {
    this.router.navigate(['/dash', 'posts']);
  }

  /**
   * @desc This function will Update entry.
   */
  async updateEntry(asDraft?: boolean): Promise<void> {
    if (asDraft) {
      this.entry.status = EntryStatuses.DRAFT;
    }
    // Update tag id-s array.
    await this.entry.tags.map((tag: Tag): number => this.entry.tag_ids.push(tag.id));
    // API call.
    this.entryService.put(`website/entry/${this.entry.id}/`, this.entry).subscribe((data: Entry): void => {
      // Update entry data.
      this.entry = data;
    }, (error: Array<Object>): void => {
      console.log(error);
    });
  }


  /*
  * This function will prevent break lines.
  * */
  preventTitleBreak(event: any): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  /*
  * This function handles route leave event.
  * */
  ionViewWillLeave() {
    // Check if there is a back button subscription.
    if (this.backButtonSubscription) {
      // Unsubscribe back button event.
      this.backButtonSubscription.unsubscribe();
    }
  }

  /*
  * This function handles route enter event.
  * */
  ionViewWillEnter() {
    // Instance of entry.
    this.entry = new Entry({ content: '', site: this.authService.blogValue.id });
    // Subscribe to current route's params.
    this.route.params.subscribe((params: Params): void => {
      // Check if there is 'entryId' in params.
      if (params.entryId) {
        // Get entry based on param's 'entryId' value.
        this.entryService.detail(`website/entry/${params.entryId}/`).subscribe((data: Entry): void => {
          // Update entry.
          this.entry = data;
        });
      }
    });
  }
}
