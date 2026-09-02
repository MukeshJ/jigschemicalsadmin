import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { LogDetailResolverService } from './log-detail-resolver';
import { NLogDetailComponent } from './n-log-detail/n-log-detail.component';
import { NLogListComponent } from './n-log-list/n-log-list.component';

export const routes: Routes = [
  {
    path: '',
    component: NLogListComponent,
    data: { claimType: 'logs_view_error_logs' },
    canActivate: [AuthGuard]
  }, {
    path: ':id',
    component: NLogDetailComponent,
    canActivate: [AuthGuard],
    resolve: { log: LogDetailResolverService },
  }
];
