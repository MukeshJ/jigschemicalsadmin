import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentTermComponent } from './manage-payment-term.component';

describe('ManagePaymentTermComponent', () => {
  let component: ManagePaymentTermComponent;
  let fixture: ComponentFixture<ManagePaymentTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePaymentTermComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymentTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
