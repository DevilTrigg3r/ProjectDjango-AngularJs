import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadNotificationsComponent } from './download-notifications.component';

describe('DownloadNotificationsComponent', () => {
  let component: DownloadNotificationsComponent;
  let fixture: ComponentFixture<DownloadNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
