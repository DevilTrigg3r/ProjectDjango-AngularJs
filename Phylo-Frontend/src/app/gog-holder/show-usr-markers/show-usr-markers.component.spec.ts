import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsrMarkersComponent } from './show-usr-markers.component';

describe('ShowUsrMarkersComponent', () => {
  let component: ShowUsrMarkersComponent;
  let fixture: ComponentFixture<ShowUsrMarkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowUsrMarkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUsrMarkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
