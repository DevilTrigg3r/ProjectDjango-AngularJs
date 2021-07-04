import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrthologsComponent } from './orthologs.component';

describe('OrthologsComponent', () => {
  let component: OrthologsComponent;
  let fixture: ComponentFixture<OrthologsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrthologsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrthologsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
