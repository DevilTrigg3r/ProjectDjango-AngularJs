import { TestBed } from '@angular/core/testing';

import { GogNotificationService } from './gog-notification.service';

describe('GogNotificationService', () => {
  let service: GogNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GogNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
