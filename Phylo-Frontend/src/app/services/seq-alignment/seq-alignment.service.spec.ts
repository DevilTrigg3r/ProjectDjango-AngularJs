import { TestBed } from '@angular/core/testing';

import { SeqAlignmentService } from './seq-alignment.service';

describe('SeqAlignmentService', () => {
  let service: SeqAlignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeqAlignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
