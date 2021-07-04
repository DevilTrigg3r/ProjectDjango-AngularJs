import { TestBed } from '@angular/core/testing';

import { GogDownloadWebsocketService } from './gog-download-websocket.service';

describe('GogDownloadWebsocketService', () => {
  let service: GogDownloadWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GogDownloadWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
