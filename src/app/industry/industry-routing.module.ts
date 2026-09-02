import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndustryListComponent } from './industry-list/industry-list.component';
import { IndustryDetailComponent } from './industry-detail/industry-detail.component';
import { IndustryResolverService } from './industry-detail/industry-resolver.service';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: IndustryListComponent,
    data: { claimType: 'industry_view_industries' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: IndustryDetailComponent,
    resolve: {
      industry: IndustryResolverService
    },
    data: { claimType: ['industry_add_industry', 'industry_update_industry'] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryRoutingModule { }
