import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { StockReportComponent } from './stock-report.component';



export const routes: Routes = [
  {
    path:'',
    component: StockReportComponent,
     data: { claimType: 'reports_view_stock_report' },
     canActivate: [AuthGuard],
  }
];
