

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { PurchasePaymentReportComponent } from './purchase-payment-report.component';

const routes: Routes = [
  {
    path:'',
    component: PurchasePaymentReportComponent,
     data: { claimType: 'reports_view_purchase_payment_report' },
     canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasePaymentReportRoutingModule { }
