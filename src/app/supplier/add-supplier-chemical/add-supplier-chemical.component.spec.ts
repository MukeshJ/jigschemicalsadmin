import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierChemicalComponent } from './add-supplier-chemical.component';

describe('AddSupplierChemicalComponent', () => {
  let component: AddSupplierChemicalComponent;
  let fixture: ComponentFixture<AddSupplierChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
