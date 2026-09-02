import { NgModule } from '@angular/core';
import { ActionListComponent } from './action-list/action-list.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ActionListComponent,
    canActivate: [AuthGuard],
    data: { claimType: 'permission' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionRoutingModule { }
