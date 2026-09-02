import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderReportComponent } from './purchase-order-report.component';
import { AuthGuard } from '@core/security/auth.guard';


const routes: Routes = [
  {
    path:'',
    component: PurchaseOrderReportComponent,
     data: { claimType: 'reports_view_purchase_orders_report' },
     canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderReportRoutingModule { }
