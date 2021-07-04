import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GogHolderComponent } from './gog-holder.component';

describe('GogHolderComponent', () => {
  let component: GogHolderComponent;
  let fixture: ComponentFixture<GogHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GogHolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GogHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
