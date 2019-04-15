import { Injectable } from '@angular/core';
import { BaseModelService } from '../base-model/base-model.service';
import { Tag } from '../../models/tag/tag';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseModelService<Tag> {

  constructor(http: HttpClient, apiService: ApiService) {
    super(http, apiService);
    this.modelClass = Tag;
  }
}
