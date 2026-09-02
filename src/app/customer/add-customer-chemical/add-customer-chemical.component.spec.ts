import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerChemicalComponent } from './add-customer-chemical.component';

describe('AddCustomerChemicalComponent', () => {
  let component: AddCustomerChemicalComponent;
  let fixture: ComponentFixture<AddCustomerChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
