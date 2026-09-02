import { IndustryChemicalComponent } from './industry-chemical.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: IndustryChemicalComponent,
    data: { claimType: 'industry_assign_chemicals_to_industry' },
    canActivate: [AuthGuard]
  },
];
