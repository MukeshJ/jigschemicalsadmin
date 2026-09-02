import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalSuppliersComponent } from './chemical-suppliers.component';

describe('ChemicalSuppliersComponent', () => {
  let component: ChemicalSuppliersComponent;
  let fixture: ComponentFixture<ChemicalSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
