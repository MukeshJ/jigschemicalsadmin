import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChemicalSupplierComponent } from './add-chemical-supplier.component';

describe('AddChemicalSupplierComponent', () => {
  let component: AddChemicalSupplierComponent;
  let fixture: ComponentFixture<AddChemicalSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChemicalSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChemicalSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
