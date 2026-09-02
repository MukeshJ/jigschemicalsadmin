import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { SalesOrderReportComponent } from './sales-order-report.component';
import { AuthGuard } from '@core/security/auth.guard';



export const routes: Routes = [
  {
    path:'',
    component: SalesOrderReportComponent,
     data: { claimType: 'reports_view_sales_order_report' },
     canActivate: [AuthGuard]
  }
];
