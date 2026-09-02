import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMethodListPresentationComponent } from './delivery-method-list-presentation.component';

describe('DeliveryMethodListPresentationComponent', () => {
  let component: DeliveryMethodListPresentationComponent;
  let fixture: ComponentFixture<DeliveryMethodListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryMethodListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryMethodListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
