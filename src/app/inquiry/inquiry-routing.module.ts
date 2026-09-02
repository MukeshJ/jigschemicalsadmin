import { NgModule } from '@angular/core';
import { InquiryListComponent } from './inquiry-list/inquiry-list.component';
import { RouterModule, Routes } from '@angular/router';
import { AddInquiryComponent } from './add-inquiry/add-inquiry.component';
import { AddInquiryResolverService } from './add-inquiry/add-inquiry-resolver.service';
import { InquiryDetailComponent } from './inquiry-detail/inquiry-detail.component';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: InquiryListComponent,
    data: { claimType: 'inquiry_view_inquiries' },
    canActivate: [AuthGuard]
  }, {
    path: 'add',
    component: AddInquiryComponent,
    data: { claimType: 'inquiry_add_inquiry' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: InquiryDetailComponent,
    resolve: {
      inquiry: AddInquiryResolverService,
    },
    data: { claimType: 'inquiry_update_inquiry' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryRoutingModule { }
