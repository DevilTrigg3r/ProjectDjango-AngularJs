import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUsrMarkersComponent } from './add-edit-usr-markers.component';

describe('AddEditUsrMarkersComponent', () => {
  let component: AddEditUsrMarkersComponent;
  let fixture: ComponentFixture<AddEditUsrMarkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditUsrMarkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditUsrMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
