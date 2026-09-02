import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '@core/domain-classes/category';
import { DocumentAuditTrail } from '@core/domain-classes/document-audit-trail';
import { DocumentCategories } from '@core/domain-classes/document-categories';
import { DocumentInfo } from '@core/domain-classes/document-info';
import { DocumentOperation } from '@core/domain-classes/document-operation';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { DocumentService } from '../document.service';
import { MatFormField, MatLabel, MatSelect, MatOption } from '@angular/material/select';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    HasClaimDirective,
    TranslatePipe,
  ],
})
export class DocumentEditComponent extends BaseComponent implements OnInit {
  documentForm: UntypedFormGroup;
  extension: string = '';
  @Input() categories: Category[];
  @Input() documentInfo: DocumentInfo;
  documentSource: string;

  constructor(
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DocumentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentCategories,
    private toastrService: ToastrService,
    private documentService: DocumentService,
    private commonService: CommonService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createDocumentForm();
    this.patchDocumentForm();
  }
  patchDocumentForm() {
    this.documentForm.patchValue({
      name: this.data.document.name,
      description: this.data.document.description,
      categoryId: this.data.document.categoryId,
    });
  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      categoryId: ['', [Validators.required]],
    });
  }

  SaveDocument() {
    if (this.documentForm.valid) {
      this.sub$.sink = this.documentService
        .updateDocument(this.buildDocumentObject())
        .subscribe((c) => {
          this.toastrService.success(
            this.translationService.getValue('DOCUMENT_UPDATE_SUCCESSFULLY'),
          );
          this.dialogRef.close('loaded');
          this.addDocumentTrail();
        });
    } else {
      this.markFormGroupTouched(this.documentForm);
    }
  }

  addDocumentTrail() {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: this.data.document.id,
      operationName: DocumentOperation.Modified.toString(),
    };
    this.sub$.sink = this.commonService
      .addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe((c) => {});
  }

  private markFormGroupTouched(formGroup: UntypedFormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  buildDocumentObject(): DocumentInfo {
    const document: DocumentInfo = {
      id: this.data.document.id,
      categoryId: this.documentForm.get('categoryId').value,
      description: this.documentForm.get('description').value,
      name: this.documentForm.get('name').value,
    };
    return document;
  }
  onDocumentCancel() {
    this.dialogRef.close('canceled');
  }
}
