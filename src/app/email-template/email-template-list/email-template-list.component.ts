import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { EmailTemplate } from '@core/domain-classes/email-template';
import { CommonError } from '@core/error-handler/common-error';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { EmailTemplateService } from '../email-template.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { RouterLinkActive, RouterLink } from '@angular/router';
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
  selector: 'app-email-template-list',
  templateUrl: './email-template-list.component.html',
  styleUrls: ['./email-template-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLinkActive,
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
export class EmailTemplateListComponent extends BaseComponent implements OnInit {
  emailTemplates: EmailTemplate[] = [];
  displayedColumns: string[] = ['action', 'name', 'subject'];
  constructor(
    private emailTemplateService: EmailTemplateService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef, 
  ) {
    super();
  }

  ngOnInit(): void {
    this.getEmailTemplates();
  }

  delteEmailTemplate(emailTemplate: EmailTemplate) {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${areU}:: ${emailTemplate.name}`)
      .subscribe((flag: boolean) => {
        if (flag) {
          this.sub$.sink = this.emailTemplateService
            .deleteEmailTemplate(emailTemplate)
            .subscribe(() => {
              this.toastrService.success(
                this.translationService.getValue('EMAIL_TEMPLATE_DELETED_SUCCESSFULLY'),
              );
              this.getEmailTemplates();
            });
        }
      });
  }

  getEmailTemplates(): void {
    this.sub$.sink = this.emailTemplateService.getEmailTemplates().subscribe(
      (data: EmailTemplate[]) => {
        this.emailTemplates = data;
        this.cdr.detectChanges();
      },
      (err: CommonError) => {
        err.messages.forEach((msg) => {
          this.toastrService.error(msg);
        });
      },
    );
  }
}
