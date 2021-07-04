import { TestBed } from '@angular/core/testing';

import { GogCommonService } from './gog-common.service';

describe('GogCommonService', () => {
  let service: GogCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GogCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
