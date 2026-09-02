import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSOListComponent } from './customer-so-list.component';

describe('CustomerSOListComponent', () => {
  let component: CustomerSOListComponent;
  let fixture: ComponentFixture<CustomerSOListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSOListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSOListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
