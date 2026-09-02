import { ExpenseCategoryListComponent } from './expense-category-list/expense-category-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: ExpenseCategoryListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'expense_manage_expense_category' },
  }
];
