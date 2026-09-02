import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTermComponent } from './payment-term.component';

describe('PaymentTermComponent', () => {
  let component: PaymentTermComponent;
  let fixture: ComponentFixture<PaymentTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTermComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
