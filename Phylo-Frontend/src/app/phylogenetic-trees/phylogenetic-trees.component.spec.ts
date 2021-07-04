import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhylogeneticTreesComponent } from './phylogenetic-trees.component';

describe('PhylogeneticTreesComponent', () => {
  let component: PhylogeneticTreesComponent;
  let fixture: ComponentFixture<PhylogeneticTreesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhylogeneticTreesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhylogeneticTreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
