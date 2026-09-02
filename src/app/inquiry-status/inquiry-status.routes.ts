import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { InquiryStatusListComponent } from './inquiry-status-list/inquiry-status-list.component';

export const routes: Routes = [
  {
    path: '',
    component: InquiryStatusListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'inquiry_manage_inquiry_statuses' },
  }
];
