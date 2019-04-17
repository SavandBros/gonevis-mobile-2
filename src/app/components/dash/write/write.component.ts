import { Component, ElementRef, HostListener } from '@angular/core';
import Entry from '../../../models/entry/entry';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EntryService } from '../../../services/entry/entry.service';
import './editor-config';
import { AuthService } from '../../../services/auth/auth.service';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { WriteModalComponent } from '../write-modal/write-modal.component';
import { Tag } from '../../../models/tag/tag';
import { EntryStatuses } from '../../../enums/entry_statuses/entry_statuses';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss'],
})
export class WriteComponent {
  // Current entry's id.
  private entryId: string;
  // Platform back button subscription.
  backButtonSubscription: Subscription;
  // Instance of entry.
  entry: Entry = new Entry({ content: '', site: this.authService.blogValue.id });
  // And instance of entry which will hold old entry.
  private oldEntry: Entry;

  // Host listener which will listen to 'message' event.
  @HostListener('window:message', ['$event'])
  embedListeners(event: any): void {
    // Check if  there is 'elementId' in event's 'data' property.
    if (event.data.elementId) {
      // Element with specific attribute.
      this.elm.nativeElement.querySelectorAll(`[data-embed-url='${event.data.elementId}']`).forEach(
        (element: Element): void => {
          // Update element's 'height' style property.
          element.setAttribute('height', event.data.height + 'px');
        }
      );
    }
  }

  constructor(private route: ActivatedRoute, private router: Router,
              private elm: ElementRef, private platform: Platform,
              private modalController: ModalController, private alertController: AlertController,
              private loadingController: LoadingController, private toastController: ToastController,
              private entryService: EntryService, private authService: AuthService,
              private translateService: TranslateService) {
    // Subscribe to platform's back button event.
    this.backButtonSubscription = this.platform.backButton.subscribe((): void => {
      this.goBack();
    });
  }

  presentToast(message: string, color?: string): void {
    this.translateService.get(message).subscribe(async (translation: string): Promise<void> => {
      // Wait for toast creation.
      const toast = await this.toastController.create({
        message: translation,
        duration: 3500,
        color: color ? color : 'dark'
      });
      // Present toast.
      toast.present();
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
        if (data.data) {
          // Update entry based on returned data.
          this.entry = data.data.entry;
        }
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Ready to publish?',
      buttons: [{
        text: 'Not yet',
        cssClass: 'secondary',
        handler: (): Promise<void> => this.updateEntry(true)
      }, {
        text: 'Publish',
        handler: (): Promise<void> => this.updateEntry()
      }]
    });

    await alert.present();
  }

  /*
  * This function will save post as draft and navigates to 'posts' route.
  * */
  goBack(): void {
    let isEqual = equal(this.entry, this.oldEntry);
    // Check equality.
    if (this.oldEntry.entrydraft) {
      isEqual = equal(this.entry, this.oldEntry.entrydraft);
    }
    if (!isEqual) {
      // Check if entry's status is published.
      if (this.entry.status === EntryStatuses.PUBLISHED) {
        delete this.entry.status;
      }
      // Update entry and navigate to posts list.
      this.updateEntry(null, true).then(() => this.router.navigate(['/dash', 'posts']));
    } else {
      this.router.navigate(['/dash', 'posts']);
    }
  }

  /**
   * This function will Update entry.
   */
  async updateEntry(asDraft?: boolean, syncing?: boolean): Promise<void> {
    // Create loading instance.
    const loading = await this.loadingController.create({
      message: this.translateService.instant(syncing ? 'SYNCING_UNSAVED_CHANGES' : 'UPDATING'),
    });
    // Present loading.
    loading.present();

    // If draft, then change entry's status.
    if (asDraft) {
      this.entry.status = EntryStatuses.DRAFT;
    }
    // Update tag id-s array.
    await this.entry.tags.map((tag: Tag): number => this.entry.tag_ids.push(tag.id));
    if (!this.entry.tags.length) {
      this.entry.tag_ids = null;
    }
    // API call.
    await this.entryService.put(`website/entry/${this.entryId}/`, this.entry).toPromise().then((data: Entry): void => {
      // Update entry data.
      this.entry = data;
      // Update old entry data.
      this.oldEntry = cloneDeep(data);
      loading.dismiss();
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
    // Make a copy of entry.
    this.oldEntry = cloneDeep(this.entry);
    // Subscribe to current route's params.
    this.route.params.subscribe((params: Params): void => {
      // Check if there is 'entryId' in params.
      if (params.entryId) {
        // Update current entry's id.
        this.entryId = params.entryId;
        // Get entry based on param's 'entryId' value.
        this.entryService.detail(`website/entry/${params.entryId}/`).subscribe((data: Entry): void => {
          // Make a copy of returned data.
          this.oldEntry = cloneDeep(data);
          if (data.entrydraft) {
            data = data.entrydraft;
            this.presentToast('UNPUBLISHED_CHANGES', 'warning');
          }
          // Update entry.
          this.entry = data;
        });
      }
    });
  }
}
