import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryChartComponent } from './inquiry-chart.component';

describe('InquiryChartComponent', () => {
  let component: InquiryChartComponent;
  let fixture: ComponentFixture<InquiryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
