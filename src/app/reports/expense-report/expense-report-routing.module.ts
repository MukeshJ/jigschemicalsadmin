import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseReportComponent } from './expense-report.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';



const routes: Routes = [
  {
    path:'',
    component:ExpenseReportComponent,
     data: { claimType: 'reports_view_expense_report' },
     canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseReportRoutingModule { }
