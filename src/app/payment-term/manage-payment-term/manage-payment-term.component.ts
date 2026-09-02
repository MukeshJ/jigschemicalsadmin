import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentTerm } from '@core/domain-classes/payment-term';
import { PaymentTermService } from '@core/services/payment-term.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  standalone: false,
  selector: 'app-manage-payment-term',
  templateUrl: './manage-payment-term.component.html',
  styleUrls: ['./manage-payment-term.component.scss']
})
export class ManagePaymentTermComponent  extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  paymentTermForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManagePaymentTermComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentTerm,
    private paymentTermService: PaymentTermService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private translationService:TranslationService) {
    super();
  }
  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.paymentTermForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.paymentTermForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  savePaymentTerm(): void {
    if (!this.paymentTermForm.valid) {
      this.paymentTermForm.markAllAsTouched();
      return;
    }
    const paymentTerm: PaymentTerm = this.paymentTermForm.value;

    if (this.data.id) {
      this.paymentTermService.update(paymentTerm)
      .subscribe(() => {
        this.toastrService.success(this.translationService.getValue('PAYMENT_TERM_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.paymentTermService.add(paymentTerm).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('PAYMENT_TERM_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}

