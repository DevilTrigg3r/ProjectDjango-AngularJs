import { TestBed } from '@angular/core/testing';

import { SpeciesSciGeneService } from './species-sci-gene.service';

describe('SpeciesSciGeneService', () => {
  let service: SpeciesSciGeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeciesSciGeneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
