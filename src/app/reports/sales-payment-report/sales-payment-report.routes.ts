import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { SalesPaymentReportComponent } from './sales-payment-report.component';
import { AuthGuard } from '@core/security/auth.guard';



export const routes: Routes = [
  {
    path:'',
    component: SalesPaymentReportComponent,
     data: { claimType: 'reports_view_sales_order_payment_report' },
     canActivate: [AuthGuard]
  }
];
