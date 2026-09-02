import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { DocumentInfo } from '@core/domain-classes/document-info';
import { DocumentPermission } from '@core/domain-classes/document-permission';
import { PermissionUserRole } from '@core/domain-classes/permission-user-role';
import { Role } from '@core/domain-classes/role';
import { User } from '@core/domain-classes/user';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { DocumentService } from '../../document.service';
import { DocumentPermissionService } from '../document-permission.service';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { NgFor, NgIf } from '@angular/common';
import { MatLabel, MatSelect, MatOption, MatSuffix, MatError } from '@angular/material/select';
import {
  MatDatepickerInput,
  MatDatepicker,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-document-permission-multiple',
  templateUrl: './document-permission-multiple.component.html',
  styleUrls: ['./document-permission-multiple.component.scss'],
  imports: [
    MatChipSet,
    NgFor,
    MatChip,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckbox,
    NgIf,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
    MatSuffix,
    MatError,
    TranslatePipe,
  ],
})
export class DocumentPermissionMultipleComponent extends BaseComponent implements OnInit {
  documentPermissions: DocumentPermission[] = [];
  documents: DocumentInfo[];
  users: User[] = [];
  roles: Role[] = [];
  permissionForm: UntypedFormGroup;
  minDate: Date = new Date();
  constructor(
    private documentService: DocumentService,
    private documentPermissionService: DocumentPermissionService,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: DocumentInfo[],
    private dialogRef: MatDialogRef<DocumentPermissionMultipleComponent>,
    private fb: UntypedFormBuilder,
    private translationService: TranslationService,
  ) {
    super();
  }
  ngOnInit() {
    this.documents = this.data;
    this.getUsers();
    this.getRoles();
    this.createFormGroup();
  }
  createFormGroup() {
    this.permissionForm = this.fb.group({
      roles: [],
      users: [],
      isTimeBound: [false],
      startDate: [],
      endDate: [],
      isAllowDownload: [false],
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

  buildObject() {
    const permissionUserRole: PermissionUserRole = {
      roles: this.permissionForm.get('roles').value,
      users: this.permissionForm.get('users').value,
      isTimeBound: this.permissionForm.get('isTimeBound').value,
      startDate: this.permissionForm.get('startDate').value,
      endDate: this.permissionForm.get('endDate').value,
      isAllowDownload: this.permissionForm.get('isAllowDownload').value,
      documents: this.documents.map((c) => c.id),
    };
    return permissionUserRole;
  }
  saveDocumentUserPermission() {
    const permissionUserRole = this.buildObject();
    if (!permissionUserRole.roles && !permissionUserRole.users) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_USER_OR_ROLE'));
    }
    this.sub$.sink = this.documentPermissionService
      .multipleDocumentsToUsersAndRoles(permissionUserRole)
      .subscribe((c) => {
        this.toastrService.success(
          this.translationService.getValue('DOCUMENTS_PERMISSION_ASSIGN_TO_USERS_AND_ROLES'),
        );
        this.dialogRef.close();
      });
  }
  getUsers() {
    this.sub$.sink = this.commonService
      .getUsers()
      .subscribe((users: User[]) => (this.users = users));
  }

  getRoles() {
    this.sub$.sink = this.commonService
      .getRoles()
      .subscribe((roles: Role[]) => (this.roles = roles));
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
