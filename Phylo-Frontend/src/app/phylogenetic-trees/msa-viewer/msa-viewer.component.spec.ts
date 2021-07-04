import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaViewerComponent } from './msa-viewer.component';

describe('MsaViewerComponent', () => {
  let component: MsaViewerComponent;
  let fixture: ComponentFixture<MsaViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsaViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsaViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
