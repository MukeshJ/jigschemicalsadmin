import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { CustomerChemicalComponent } from './customer-chemical.component';

export const routes: Routes = [
  {
    path: '', component: CustomerChemicalComponent,
    data: { claimType: 'customer_assign_chemical_to_customer' },
    canActivate: [AuthGuard]
  }
];
