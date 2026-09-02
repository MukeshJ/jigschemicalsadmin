import { Component, OnInit, ViewChild } from '@angular/core';
import { MonthlyInquiry } from '@core/domain-classes/monthly-inquiry';
import { TranslationService } from '@core/services/translation.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../dashboard.service';

@Component({
  standalone: false,
  selector: 'app-inquiry-chart',
  templateUrl: './inquiry-chart.component.html',
  styleUrls: ['./inquiry-chart.component.scss']
})
export class InquiryChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

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

  public lineChartData: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        borderColor: '#3b1f91',
        backgroundColor: '#6d48dd',
      },
    ],
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
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
      this.lineChartData = {
        labels: data.map(c => c.date),
        datasets: [
          {
            data: inquiriesCount,
            label: this.translationService.getValue('INQUIRY'),
            borderColor: '#3b1f91',
            backgroundColor: '#6d48dd',
          },
        ],
      };
      this.chart?.update();
    })
  }
}
