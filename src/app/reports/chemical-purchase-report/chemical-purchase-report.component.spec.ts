import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalPurchaseReportComponent } from './chemical-purchase-report.component';

describe('ChemicalPurchaseReportComponent', () => {
  let component: ChemicalPurchaseReportComponent;
  let fixture: ComponentFixture<ChemicalPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalPurchaseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
