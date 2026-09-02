import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentUserPermission } from '@core/domain-classes/document-user-permission';
import { User } from '@core/domain-classes/user';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { DocumentPermissionService } from '../document-permission.service';
import {
  MatLabel,
  MatSelect,
  MatSelectTrigger,
  MatOption,
  MatFormField,
  MatSuffix,
  MatError,
} from '@angular/material/select';
import { NgIf, NgFor } from '@angular/common';
import { MatInput } from '@angular/material/input';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-user-permission',
  templateUrl: './manage-user-permission.component.html',
  styleUrls: ['./manage-user-permission.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatSelect,
    MatSelectTrigger,
    NgIf,
    NgFor,
    MatOption,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatError,
    TranslatePipe,
  ],
})
export class ManageUserPermissionComponent extends BaseComponent implements OnInit {
  selectedUsers: User[] = [];
  minDate: Date;
  permissionForm: UntypedFormGroup;
  constructor(
    private documentPermissionService: DocumentPermissionService,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { users: User[]; documentId: string },
    private dialogRef: MatDialogRef<ManageUserPermissionComponent>,
    private fb: UntypedFormBuilder,
    private translationService: TranslationService,
  ) {
    super();
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.createUserPermissionForm();
  }

  createUserPermissionForm() {
    this.permissionForm = this.fb.group({
      isTimeBound: new UntypedFormControl(false),
      startDate: [''],
      endDate: [''],
      isAllowDownload: new UntypedFormControl(false),
    });
  }

  timeBoundChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.permissionForm.get('startDate').setValidators([Validators.required]);
      this.permissionForm.get('endDate').setValidators([Validators.required]);
    } else {
      this.permissionForm.get('startDate').clearValidators();
      this.permissionForm.get('startDate').updateValueAndValidity();
      this.permissionForm.get('endDate').clearValidators();
      this.permissionForm.get('endDate').updateValueAndValidity();
    }
  }

  saveDocumentUserPermission() {
    if (!this.permissionForm.valid) {
      this.permissionForm.markAllAsTouched();
      return;
    }
    if (this.selectedUsers.length == 0) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_ATLEAST_ONE_USER'));
      return;
    }
    let documentUserPermission: DocumentUserPermission[] = this.selectedUsers.map((user) => {
      return Object.assign(
        {},
        {
          id: '',
          documentId: this.data.documentId,
          userId: user.id,
        },
        this.permissionForm.value,
      );
    });

    this.sub$.sink = this.documentPermissionService
      .addDocumentUserPermission(documentUserPermission)
      .subscribe(() => {
        this.toastrService.success(
          this.translationService.getValue('PERMISSION_ADDED_SUCCESSFULLY'),
        );
        this.dialogRef.close(true);
      });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
