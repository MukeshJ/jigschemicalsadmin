import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalTypeListComponent } from './chemical-type-list.component';

describe('ChemicalTypeListComponent', () => {
  let component: ChemicalTypeListComponent;
  let fixture: ComponentFixture<ChemicalTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
