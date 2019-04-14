import { Component, OnInit } from '@angular/core';
import { IonRefresher } from '@ionic/angular';
import { ApiResponseService } from '../../../services/api-response/api-response.service';
import Entry from '../../../models/entry/entry';
import { ActivatedRoute, Data } from '@angular/router';
import { EntryService } from '../../../services/entry/entry.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UserBlog } from '../../../models/user/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  // This variable indicates whether we are getting entries or not.
  loading: boolean;
  // Entries API response.
  entries: ApiResponseService<Entry> = new ApiResponseService<Entry>(0, null, null, []);
  // This variable indicates whether we should show entries or pages.
  isPage: boolean;
  // Search form.
  searchForm: FormGroup;
  // List of skeletons.
  skeletons: Array<number> = Array(5);

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
              private entryService: EntryService, private authService: AuthService) {
    // Update loading state.
    this.loading = true;
    // Setup search form.
    this.searchForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Param event subscription.
    this.route.data.subscribe((value: Data): void => {
      this.isPage = !!value.isPage;
      this.getEntries();
    });

    // Dynamically get current blog's data.
    this.authService.blog.subscribe((blog: UserBlog): void => {
      this.getEntries();
    });
  }

  getEntries(refreshEvent?: IonRefresher): void {
    if (!refreshEvent) {
      // Update loading state.
      this.loading = true;
    }
    // Set needed params.
    const params: { [key: string]: string } = {
      site: this.authService.blogValue.id,
      is_page: this.isPage.toString(),
      search: this.searchForm.controls.text.value
    };
    // API call.
    this.entryService.get('website/entry/', params).subscribe((data: ApiResponseService<Entry>): void => {
      // If there was a refresh event, then stop refreshing.
      if (refreshEvent) {
        refreshEvent['target'].complete();
      }
      this.entries = data;
      // Update loading state.
      this.loading = false;
    });
  }

  private async clearSearch(): Promise<void> {
    return await this.searchForm.controls.text.setValue('');
  }

  onSearchClear(): void {
    this.clearSearch().then((): void => this.getEntries());
  }
}
