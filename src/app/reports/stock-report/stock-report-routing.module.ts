import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { StockReportComponent } from './stock-report.component';



const routes: Routes = [
  {
    path:'',
    component: StockReportComponent,
     data: { claimType: 'reports_view_stock_report' },
     canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockReportRoutingModule { }
