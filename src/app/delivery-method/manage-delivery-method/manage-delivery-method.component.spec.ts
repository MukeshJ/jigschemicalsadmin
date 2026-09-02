import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeliveryMethodComponent } from './manage-delivery-method.component';

describe('ManageDeliveryMethodComponent', () => {
  let component: ManageDeliveryMethodComponent;
  let fixture: ComponentFixture<ManageDeliveryMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDeliveryMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDeliveryMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
