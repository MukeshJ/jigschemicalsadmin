import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { LoginAuditListComponent } from './login-audit-list/login-audit-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginAuditListComponent,
    data: { claimType: 'logs_view_login_audits' },
    canActivate: [AuthGuard]
  }
];
