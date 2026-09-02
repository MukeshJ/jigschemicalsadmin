import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { SalesPurchaseReportComponent } from './sales-purchase-report.component';



const routes: Routes = [
  {
    path: '',
    component: SalesPurchaseReportComponent,
     data: { claimType: 'reports_view_sales_vs_purchase_report' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesPurchaseRoutingModule { }
