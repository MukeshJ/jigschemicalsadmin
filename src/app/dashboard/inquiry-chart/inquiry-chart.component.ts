import { Component, OnInit, ViewChild } from '@angular/core';
import { MonthlyInquiry } from '@core/domain-classes/monthly-inquiry';
import { TranslationService } from '@core/services/translation.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-inquiry-chart',
  templateUrl: './inquiry-chart.component.html',
  styleUrls: ['./inquiry-chart.component.scss']
})
export class InquiryChartComponent implements OnInit {
  months = [
    {
      id: 1,
      name: 'January'
    }, {
      id: 2,
      name: 'February'
    }, {
      id: 3,
      name: 'March'
    }, {
      id: 4,
      name: 'April'
    }, {
      id: 5,
      name: 'May'
    }, {
      id: 6,
      name: 'June'
    }, {
      id: 7,
      name: 'July'
    }, {
      id: 8,
      name: 'August'
    }, {
      id: 9,
      name: 'September'
    }, {
      id: 10,
      name: 'October'
    }, {
      id: 11,
      name: 'November'
    }, {
      id: 12,
      name: 'December'
    }
  ];
  years = [];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  public lineChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];

  public lineChartLabels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartColors: any[] = [
    {
      borderColor: '#3b1f91',
      backgroundColor: '#6d48dd',
    },
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private dashboardService: DashboardService,
    private translationService: TranslationService) { }

  ngOnInit(): void {
    for (let index = 1995; index < 2050; index++) {
      this.years.push(index);
    }
    this.getMonthlyInquiryStatistic();
  };

  getMonthlyInquiryStatistic() {
    this.dashboardService.getMonthlyInquiryStatistic(this.selectedMonth, this.selectedYear).subscribe((data: MonthlyInquiry[]) => {
      const inquiriesCount = data.map(c => c.noOfInquiry);
      this.lineChartData = [
        { data: inquiriesCount, label: this.translationService.getValue('INQUIRY') }
      ];
      this.lineChartLabels = data.map(c => c.date);
    })
  }
}
