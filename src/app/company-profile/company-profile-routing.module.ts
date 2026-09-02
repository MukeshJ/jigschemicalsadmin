import { CompanyProfileComponent } from './company-profile.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { CompanyProfileResolver } from './company-profile.resolver';

export const routes: Routes = [
  {
    path: '',
    component: CompanyProfileComponent,
    data: { claimType: 'settings_update_company_profile' },
    canActivate: [AuthGuard],
    resolve: {
      profile: CompanyProfileResolver
    },
  }
];
