import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailSmtpSettingListComponent } from './email-smtp-setting-list/email-smtp-setting-list.component';
import { AuthGuard } from '@core/security/auth.guard';
import { ManageEmailSmtpSettingComponent } from './manage-email-smtp-setting/manage-email-smtp-setting.component';
import { EmailSMTPSettingDetailResolver } from './email-settting-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: EmailSmtpSettingListComponent,
    data: { claimType: 'email_view_smtp_settings' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage/:id',
    component: ManageEmailSmtpSettingComponent,
    data: { claimType: 'email_update_smtp_setting' },
    resolve: { smtpSetting: EmailSMTPSettingDetailResolver },
    canActivate: [AuthGuard]
  }, {
    path: 'manage',
    component: ManageEmailSmtpSettingComponent,
    data: { claimType: 'email_add_smtp_setting' },
    canActivate: [AuthGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailSmtpSettingRoutingModule { }
