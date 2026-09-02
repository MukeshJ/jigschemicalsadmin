import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierChemicalComponent } from './supplier-chemical.component';

describe('SupplierChemicalComponent', () => {
  let component: SupplierChemicalComponent;
  let fixture: ComponentFixture<SupplierChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
