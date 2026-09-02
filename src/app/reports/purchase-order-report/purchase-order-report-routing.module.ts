import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { PurchaseOrderReportComponent } from './purchase-order-report.component';
import { AuthGuard } from '@core/security/auth.guard';


export const routes: Routes = [
  {
    path:'',
    component: PurchaseOrderReportComponent,
     data: { claimType: 'reports_view_purchase_orders_report' },
     canActivate: [AuthGuard]
  }
];
