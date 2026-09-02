import { SupplierChemicalComponent } from './supplier-chemical.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: SupplierChemicalComponent,
    data: { claimType: 'supplier_assign_chemical_to_supplier' },
    canActivate: [AuthGuard]
  },
];
