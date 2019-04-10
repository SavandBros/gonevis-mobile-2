import { TestBed } from '@angular/core/testing';

import { ApiResponseService } from './api-response.service';

describe('ApiResponseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiResponseService = TestBed.get(ApiResponseService);
    expect(service).toBeTruthy();
  });
});
