import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { PaymentTermComponent } from './payment-term.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentTermComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'sales_order_manage_payment_terms' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentTermRoutingModule { }
