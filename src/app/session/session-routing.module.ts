import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { SessionComponent } from './session.component';

export const routes: Routes = [
  {
    path: '',
    component: SessionComponent,
    data: { claimType: 'users_view_current_online_users' },
    canActivate: [AuthGuard]
  }
];
