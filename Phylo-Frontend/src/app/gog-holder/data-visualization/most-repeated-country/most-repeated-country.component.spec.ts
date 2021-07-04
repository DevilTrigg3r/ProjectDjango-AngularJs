import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostRepeatedCountryComponent } from './most-repeated-country.component';

describe('MostRepeatedCountryComponent', () => {
  let component: MostRepeatedCountryComponent;
  let fixture: ComponentFixture<MostRepeatedCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostRepeatedCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostRepeatedCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
