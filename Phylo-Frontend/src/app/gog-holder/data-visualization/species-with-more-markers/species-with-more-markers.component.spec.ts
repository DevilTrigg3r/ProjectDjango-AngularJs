import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesWithMoreMarkersComponent } from './species-with-more-markers.component';

describe('SpeciesWithMoreMarkersComponent', () => {
  let component: SpeciesWithMoreMarkersComponent;
  let fixture: ComponentFixture<SpeciesWithMoreMarkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeciesWithMoreMarkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeciesWithMoreMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
