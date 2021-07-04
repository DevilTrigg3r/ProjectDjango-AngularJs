import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcbiinsightsComponent } from './ncbiinsights.component';

describe('NcbiinsightsComponent', () => {
  let component: NcbiinsightsComponent;
  let fixture: ComponentFixture<NcbiinsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NcbiinsightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NcbiinsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
