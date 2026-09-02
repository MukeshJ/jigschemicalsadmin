import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderReportComponent } from './sales-order-report.component';
import { AuthGuard } from '@core/security/auth.guard';



const routes: Routes = [
  {
    path:'',
    component: SalesOrderReportComponent,
     data: { claimType: 'reports_view_sales_order_report' },
     canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderReportRoutingModule { }
