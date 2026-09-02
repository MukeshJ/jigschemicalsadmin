import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalCustomersComponent } from './chemical-customers.component';

describe('ChemicalCustomersComponent', () => {
  let component: ChemicalCustomersComponent;
  let fixture: ComponentFixture<ChemicalCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalCustomersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
