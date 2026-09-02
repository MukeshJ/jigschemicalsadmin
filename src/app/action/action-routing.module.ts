import { ActionListComponent } from './action-list/action-list.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ActionListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'permission' },
  }
];
