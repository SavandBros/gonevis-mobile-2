import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import Entry from '../../../models/entry/entry';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EntryService } from '../../../services/entry/entry.service';
import './editor-config';
import { AuthService } from '../../../services/auth/auth.service';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss'],
})
export class WriteComponent implements OnInit {
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
              private entryService: EntryService, private authService: AuthService) {
    // Subscribe to platform's back button event.
    this.backButtonSubscription = this.platform.backButton.subscribe((): void => {
      this.goBack();
    });
  }

  ngOnInit(): void {
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

  /*
  * This function will save post as draft and navigates to 'posts' route.
  * */
  goBack(): void {
    this.router.navigate(['/dash', 'posts']);
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
  * This function will handles route leave event.
  * */
  ionViewWillLeave() {
    // Check if there is a back button subscription.
    if (this.backButtonSubscription) {
      // Unsubscribe back button event.
      this.backButtonSubscription.unsubscribe();
    }
  }
}
