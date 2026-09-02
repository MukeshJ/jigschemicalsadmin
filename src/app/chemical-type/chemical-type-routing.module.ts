import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ChemicalTypeListComponent } from './chemical-type-list/chemical-type-list.component';

export const routes: Routes = [
  {
    path: '', component: ChemicalTypeListComponent,
    data: { claimType: 'chemical_view_chemical_types' },
    canActivate: [AuthGuard]
  }
];
