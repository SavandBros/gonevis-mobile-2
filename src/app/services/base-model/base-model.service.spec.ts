import { TestBed } from '@angular/core/testing';

import { BaseModelService } from './base-model.service';

describe('BaseModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseModelService = TestBed.get(BaseModelService);
    expect(service).toBeTruthy();
  });
});
