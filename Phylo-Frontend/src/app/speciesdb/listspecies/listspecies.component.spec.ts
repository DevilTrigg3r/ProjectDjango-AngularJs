import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListspeciesComponent } from './listspecies.component';

describe('ListspeciesComponent', () => {
  let component: ListspeciesComponent;
  let fixture: ComponentFixture<ListspeciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListspeciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListspeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
