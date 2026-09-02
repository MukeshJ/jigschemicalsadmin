import { CommonModule } from '@angular/common';
import { ExpenseReportComponent } from './expense-report.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';



export const routes: Routes = [
  {
    path:'',
    component:ExpenseReportComponent,
     data: { claimType: 'reports_view_expense_report' },
     canActivate: [AuthGuard],
  }
];
