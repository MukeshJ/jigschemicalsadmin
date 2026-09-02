import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTermPresentationComponent } from './payment-term-presentation.component';

describe('PaymentTermPresentationComponent', () => {
  let component: PaymentTermPresentationComponent;
  let fixture: ComponentFixture<PaymentTermPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTermPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTermPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
