import { TestBed } from '@angular/core/testing';

import { GogSharedService } from './gog-shared.service';

describe('GogSharedService', () => {
  let service: GogSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GogSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
