import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { EmailSMTPSetting } from '@core/domain-classes/email-smtp-setting';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { EmailSmtpSettingService } from '../email-smtp-setting.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { RouterLink } from '@angular/router';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-email-smtp-setting-list',
  templateUrl: './email-smtp-setting-list.component.html',
  styleUrls: ['./email-smtp-setting-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLink,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class EmailSmtpSettingListComponent extends BaseComponent implements OnInit {
  emailSMTPSettings: EmailSMTPSetting[] = [];
  displayedColumns: string[] = ['action', 'userName', 'host', 'port', 'isDefault'];

  constructor(
    private emailSmtpSettingService: EmailSmtpSettingService,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private cdr : ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getEmailSMTPSettings();
  }

  getEmailSMTPSettings() {
    this.sub$.sink = this.emailSmtpSettingService
      .getEmailSMTPSettings()
      .subscribe((settings: EmailSMTPSetting[]) => {
        this.emailSMTPSettings = settings;
        this.cdr.detectChanges();
      });
  }

  deleteEmailSMTPSetting(setting: EmailSMTPSetting) {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${areU} ${setting.host}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.emailSmtpSettingService
            .deleteEmailSMTPSetting(setting.id)
            .subscribe(() => {
              this.toastrService.success(
                this.translationService.getValue('EMAIL_SMTP_SETTING_DELETED_SUCCESSFULLY'),
              );
              this.getEmailSMTPSettings();
            });
        }
      });
  }
}
