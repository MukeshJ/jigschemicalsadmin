import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmailParameter } from '@core/domain-classes/email-parameter';
import { EmailTemplate } from '@core/domain-classes/email-template';
import { SendEmail } from '@core/domain-classes/send-email';
import { SendEmailSuppliers } from '@core/domain-classes/send-email-suppliers';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { EditorConfig } from '@shared/editor.config';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { EmailTemplateService } from 'src/app/email-template/email-template.service';

@Component({
  standalone: false,
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent extends BaseComponent implements OnInit {
  emailTamplates: EmailTemplate[] = [];
  selectedEmailTamplate: EmailTemplate;
  emailForm: FormGroup;
  editorConfig= EditorConfig;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private toastrService: ToastrService,
    private router: Router,
    private translationService: TranslationService,
    public dialogRef: MatDialogRef<SendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendEmailSuppliers,
    private commonService: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.createEmailForm();
    this.getEmailTamplate();
  }

  onTempateChange() {
    this.parameters.clear();
    this.emailForm.patchValue(this.selectedEmailTamplate);
    const regex = /\##(.*?)\##/gi;
    const parameters: Array<string> = this.selectedEmailTamplate.body.match(regex);
    [...new Set(parameters)].forEach(parameter => {
      this.parameters.push(this.newParameter(parameter));
    });
  }

  newParameter(parameter): FormGroup {
    return this.fb.group({
      parameter: [parameter, [Validators.required]],
      value: ['', [Validators.required]]
    })
  }

  get parameters(): FormArray {
    return <FormArray>this.emailForm.get('parameters');
  }

  setParameterValue() {
    const paramters: EmailParameter[] = this.parameters.value;
    let emailBody = this.selectedEmailTamplate.body;
    if (paramters) {
      paramters.forEach(paramter => {
        if (paramter.value) {
          emailBody = emailBody.split(paramter.parameter).join(paramter.value);
        }
      });
      this.emailForm.get('body').setValue(emailBody);
    }
  }

  getEmailTamplate() {
    this.sub$.sink = this.emailTemplateService.getEmailTemplates()
      .subscribe((emailTamplats: EmailTemplate[]) => {
        this.emailTamplates = emailTamplats;
      })
  }

  createEmailForm() {
    this.emailForm = this.fb.group({
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      parameters: this.fb.array([])
    });
  }

  sendEmail() {
    if (!this.emailForm.valid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    const sendEmail: SendEmail = {
      suppliers: this.data.suppliers.map(c => c.id),
      subject: this.emailForm.get('subject').value,
      message: this.emailForm.get('body').value
    };
    this.sub$.sink = this.commonService.sendEmail(sendEmail)
      .subscribe(c => {
        if (c) {
          this.toastrService.success("Email send to suppliers successfully.");
        }
      });

  }
  clearForm() {
    this.parameters.clear();
    this.selectedEmailTamplate = {
      name: '',
      id: '',
      body: '',
      subject: '',
    };
    this.emailForm.patchValue({
      id: [''],
      subject: ['']
    });
    this.emailForm.get('body').setValue("");

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
