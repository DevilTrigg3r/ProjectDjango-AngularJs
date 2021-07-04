import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesdbComponent } from './speciesdb.component';

describe('SpeciesdbComponent', () => {
  let component: SpeciesdbComponent;
  let fixture: ComponentFixture<SpeciesdbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeciesdbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeciesdbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
