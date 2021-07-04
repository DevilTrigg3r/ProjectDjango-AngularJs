import { TestBed } from '@angular/core/testing';

import { FastaUploadService } from './fasta-upload.service';

describe('FastaUploadService', () => {
  let service: FastaUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FastaUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
