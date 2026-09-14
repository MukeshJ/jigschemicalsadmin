import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { SalesVsPurchase } from '@core/domain-classes/sales-purchase';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Months } from '@core/domain-classes/months';
import { SalesPurchaseReportService } from './sales-purchase-report.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-purchase-report',
  templateUrl: './sales-purchase-report.component.html',
  styleUrls: ['./sales-purchase-report.component.scss'],
  providers: [UTCToLocalTime],
  imports: [FormsModule, BaseChartDirective, TranslatePipe],
})
export class SalesPurchaseReportComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  months = Months;
  years = [];
  barChartType: ChartType = 'bar';
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  barChartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(
    private salesPurchaseReportService: SalesPurchaseReportService,
    private uTCToLocalTime: UTCToLocalTime,
  ) {}

  ngOnInit(): void {
    for (let index = 1995; index < 2050; index++) {
      this.years.push(index);
    }
    this.getReportData();
  }

  getReportData() {
    this.salesPurchaseReportService
      .getSalesVsPurchaseReport(this.selectedMonth, this.selectedYear)
      .subscribe((data: SalesVsPurchase[]) => {
        const totalSales = data.map((c) => c.totalSales);
        const totalPurchase = data.map((c) => c.totalPurchase);
        this.barChartData.set({
          labels: data.map((c) => this.uTCToLocalTime.transform(c.date, 'shortDate')),
          datasets: [
            { data: totalSales, label: 'Sales', backgroundColor: '#2196f3' },
            { data: totalPurchase, label: 'Purchase', backgroundColor: '#3b1f91' },
          ],
        });
        this.chart?.update();
      });
  }
}
