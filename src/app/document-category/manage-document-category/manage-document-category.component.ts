import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentCategory } from '@core/domain-classes/document-category';
import { DocumentCategoryService } from '@core/services/document-category.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-document-category',
  templateUrl: './manage-document-category.component.html',
  styleUrls: ['./manage-document-category.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, NgIf, TranslatePipe],
})
export class ManageDocumentCategoryComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  documentCategoryForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageDocumentCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentCategory,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    private categoryService: DocumentCategoryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.documentCategoryForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.documentCategoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveCategory(): void {
    if (!this.documentCategoryForm.valid) {
      this.documentCategoryForm.markAllAsTouched();
      return;
    }
    const category: DocumentCategory = this.documentCategoryForm.value;

    if (this.data.id) {
      this.categoryService.update(category).subscribe(() => {
        this.toastrService.success('Category Updated Successfully');
        this.dialogRef.close();
      });
    } else {
      this.categoryService.add(category).subscribe(() => {
        this.toastrService.success('Category Saved Successfully');
        this.dialogRef.close();
      });
    }
  }
}
