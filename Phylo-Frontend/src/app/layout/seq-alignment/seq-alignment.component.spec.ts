import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeqAlignmentComponent } from './seq-alignment.component';

describe('SeqAlignmentComponent', () => {
  let component: SeqAlignmentComponent;
  let fixture: ComponentFixture<SeqAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeqAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeqAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
