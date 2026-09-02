import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PackagingType } from '@core/domain-classes/packaging-type';
import { PackagingTypeService } from '@core/services/packaging-type.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  standalone: false,
  selector: 'app-manage-packaging-type',
  templateUrl: './manage-packaging-type.component.html',
  styleUrls: ['./manage-packaging-type.component.scss']
})
export class ManagePackagingTypeComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  packagingTypeForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManagePackagingTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PackagingType,
    private packagingTypeService: PackagingTypeService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private translationService:TranslationService) {
    super();
  }
  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.packagingTypeForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.packagingTypeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  savePackagingType(): void {
    if (!this.packagingTypeForm.valid) {
      this.packagingTypeForm.markAllAsTouched();
      return;
    }
    const packagingType: PackagingType = this.packagingTypeForm.value;

    if (this.data.id) {
      this.packagingTypeService.update(packagingType).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('PACKAGING_TYPE_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.packagingTypeService.add(packagingType).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('PACKAGING_TYPE_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}
