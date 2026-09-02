import { CommonModule } from '@angular/common';
import { AuthGuard } from '@core/security/auth.guard';
import { Routes } from '@angular/router';
import { InquirySourceListComponent } from './inquiry-source-list/inquiry-source-list.component';

export const routes: Routes = [
  {
    path: '',
    component: InquirySourceListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'inquiry_manage_inquiry_sources' },
  }
];
