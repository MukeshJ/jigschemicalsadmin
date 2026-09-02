import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ContactUsComponent } from './contact-us.component';

export const routes: Routes = [
  {
    path:'',
    component: ContactUsComponent,
  //  data: { claimType: 'contact_requests_view_contact_requests' },
    canActivate: [AuthGuard]
  }
];
