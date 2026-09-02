import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ManagePageActionComponent } from './manage-page-action/manage-page-action.component';

export const routes: Routes = [
  {
    path: '',
    component: ManagePageActionComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'permission' },
  }
];
