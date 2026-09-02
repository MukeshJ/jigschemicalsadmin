import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserDetailResolverService } from './user-detail-resolver';
import { UserListComponent } from './user-list/user-list.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';

export const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    data: { claimType: 'users_view_users' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage/:id',
    component: ManageUserComponent,
    resolve: { user: UserDetailResolverService },
    data: { claimType: 'users_update_user' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage',
    component: ManageUserComponent,
    data: { claimType: 'users_add_user' },
    canActivate: [AuthGuard]
  }, {
    path: 'permission/:id',
    component: UserPermissionComponent,
    resolve: { user: UserDetailResolverService },
    data: { claimType: 'users_assign_permission' },
    canActivate: [AuthGuard]
  }
];
