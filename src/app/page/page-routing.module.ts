import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { PageListComponent } from './page-list/page-list.component';

export const routes: Routes = [
  {
    path: '',
    component: PageListComponent,
    canActivate: [AuthGuard],
    // data: { claimType: 'permission' },
  }
];
