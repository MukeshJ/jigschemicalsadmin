import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { PaymentTermComponent } from './payment-term.component';

export const routes: Routes = [
  {
    path: '',
    component: PaymentTermComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'sales_order_manage_payment_terms' },
  }
];
