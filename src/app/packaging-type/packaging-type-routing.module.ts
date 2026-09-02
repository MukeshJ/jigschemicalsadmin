import { Routes } from '@angular/router';
import { PackagingTypeListComponent } from './packaging-type-list/packaging-type-list.component';
import { AuthGuard } from '@core/security/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PackagingTypeListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'purchase_order_manage_packaging_types' },
  }
];
