import { TestBed } from '@angular/core/testing';

import { UploadMultiFastaService } from './upload-multi-fasta.service';

describe('UploadMultiFastaService', () => {
  let service: UploadMultiFastaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadMultiFastaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
