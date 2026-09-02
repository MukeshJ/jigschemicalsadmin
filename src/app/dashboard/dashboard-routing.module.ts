import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  {
    path: '',
    data: { claimType: 'dashboard_view_dashboard' },
    canActivate: [AuthGuard],
    component: DashboardComponent
  }
];
