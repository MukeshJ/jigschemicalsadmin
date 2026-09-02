import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalSalesReportComponent } from './chemical-sales-report.component';

describe('ChemicalSalesReportComponent', () => {
  let component: ChemicalSalesReportComponent;
  let fixture: ComponentFixture<ChemicalSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalSalesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
