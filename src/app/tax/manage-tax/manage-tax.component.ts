import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tax } from '@core/domain-classes/tax';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  standalone: false,
  selector: 'app-manage-tax',
  templateUrl: './manage-tax.component.html',
  styleUrls: ['./manage-tax.component.scss']
})
export class ManageTaxComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  taxForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageTaxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Tax,
    private taxService: TaxService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private translationService: TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.taxForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.taxForm = this.fb.group({
      id: [''],
      name: ['', Validators.required], 
      percentage: ['', [Validators.required,Validators.max(100)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveTax(): void {
    if (!this.taxForm.valid) {
      this.taxForm.markAllAsTouched();
      return;
    }
    const tax: Tax = this.taxForm.value;

    if (this.data.id) {
      this.taxService.update(tax).subscribe(() => {
        this.toastrService.success('Tax Saved Successfully.');
        this.dialogRef.close();
      });
    } else {
      this.taxService.add(tax).subscribe(() => {
        this.toastrService.success('Tax Saved Successfully.');
        this.dialogRef.close();
      });
    }
  }

}
