import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { DeliveryMethodListComponent } from './delivery-method-list/delivery-method-list.component';

const routes: Routes = [
  {
    path: '',
    component: DeliveryMethodListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'sales_order_manage_delivery_methods' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryMethodRoutingModule { }
