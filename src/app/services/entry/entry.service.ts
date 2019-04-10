import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { BaseModelService } from '../base-model/base-model.service';
import Entry from '../../models/entry/entry';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseModelService<Entry> {

  constructor(http: HttpClient, apiService: ApiService) {
    super(http, apiService);
    this.modelClass = Entry;
  }
}
