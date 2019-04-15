import { Component, Input, OnInit } from '@angular/core';
import Entry from '../../../models/entry/entry';
import { ModalController } from '@ionic/angular';
import { TagService } from '../../../services/tag/tag.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiResponseService } from '../../../services/api-response/api-response.service';
import { Tag } from '../../../models/tag/tag';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-write-modal',
  templateUrl: './write-modal.component.html',
  styleUrls: ['./write-modal.component.scss'],
})
export class WriteModalComponent implements OnInit {
  // Given entry.
  @Input() entry: Entry;
  // List of tags.
  tags: ApiResponseService<Tag> = new ApiResponseService(0, null, null, []);
  // This variable holds filtered tags.
  filteredTags: Array<Tag> = [];
  // Search form.
  tagForm: FormGroup;
  // This variable indicates whether tag from is focused or not.
  isFocused: boolean;

  constructor(private formBuilder: FormBuilder, private modalController: ModalController,
              private authService: AuthService, private tagService: TagService) {
    // Setup search form.
    this.tagForm = this.formBuilder.group({
      text: ['', Validators.required]
    });
    // Update 'isFocused' state.
    this.isFocused = false;
  }

  ngOnInit() {
    this.tagService.get('tagool/tag/', { site: this.authService.blogValue.id })
      .subscribe((data: ApiResponseService<Tag>): void => {
        this.tags = data;
      });
  }

  /*
  * This function will return login form controls.
  * */
  get tagFormText(): AbstractControl {
    return this.tagForm.controls.text;
  }

  filterTags(): void {
    // If value was empty.
    if (!this.tagFormText.value) {
      this.filteredTags = [];
      return;
    }
    // Filter tags based on value.
    this.filteredTags = Object.assign([], this.tags.results).filter(
      (item: Tag): boolean => !this.entry.tags.some((e) => e.id === item.id) &&
        item.name.toLowerCase().indexOf(this.tagFormText.value.toLowerCase()) > -1
    );
  }

  private async clearSearch(): Promise<void> {
    return await this.tagFormText.setValue('');
  }

  onSearchClear(): void {
    this.clearSearch().then((): void => this.filterTags());
  }

  addTag(tag: Tag): void {
    // Append tag to submit list.
    this.entry.tags.push(tag);
    // Clear tag form.
    this.onSearchClear();
  }

  removeTag(id: string, index: number): void {
    this.entry.tags.splice(index, 1);
  }

  dismiss(): void {
    this.modalController.dismiss({
      entry: this.entry
    });
  }
}
