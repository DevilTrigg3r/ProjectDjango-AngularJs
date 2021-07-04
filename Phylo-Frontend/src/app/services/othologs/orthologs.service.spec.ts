import { TestBed } from '@angular/core/testing';

import { OrthologsService } from './orthologs.service';

describe('OrthologsService', () => {
  let service: OrthologsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrthologsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
