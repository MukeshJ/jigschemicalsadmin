import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { SalesPurchaseReportComponent } from './sales-purchase-report.component';



export const routes: Routes = [
  {
    path: '',
    component: SalesPurchaseReportComponent,
     data: { claimType: 'reports_view_sales_vs_purchase_report' },
    canActivate: [AuthGuard]
  }
];
