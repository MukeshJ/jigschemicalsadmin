import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerChemicalComponent } from './customer-chemical.component';

describe('CustomerChemicalComponent', () => {
  let component: CustomerChemicalComponent;
  let fixture: ComponentFixture<CustomerChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
