import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChemicalCustomerComponent } from './add-chemical-customer.component';

describe('AddChemicalCustomerComponent', () => {
  let component: AddChemicalCustomerComponent;
  let fixture: ComponentFixture<AddChemicalCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChemicalCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChemicalCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
