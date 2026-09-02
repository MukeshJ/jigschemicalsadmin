import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ManagePageActionComponent } from './manage-page-action/manage-page-action.component';

const routes: Routes = [
  {
    path: '',
    component: ManagePageActionComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'permission' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageActionRoutingModule { }
