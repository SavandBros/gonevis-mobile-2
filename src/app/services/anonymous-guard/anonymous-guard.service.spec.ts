import { TestBed } from '@angular/core/testing';

import { AnonymousGuardService } from './anonymous-guard.service';

describe('AnonymousGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnonymousGuardService = TestBed.get(AnonymousGuardService);
    expect(service).toBeTruthy();
  });
});
