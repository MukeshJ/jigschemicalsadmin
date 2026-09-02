import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentMethod } from '@core/domain-classes/payment-method';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order/purchase-order-payment';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderPaymentService } from '../purchase-order-payment.service';

@Component({
  standalone: false,
  selector: 'app-add-purchase-order-payments',
  templateUrl: './add-purchase-order-payments.component.html',
  styleUrls: ['./add-purchase-order-payments.component.scss']
})
export class AddPurchaseOrderPaymentsComponent extends BaseComponent implements OnInit {
  paymentMethodslist: PaymentMethod[] = [];
  paymentsForm: UntypedFormGroup;
  isReceiptDeleted = false;
  constructor(
    public dialogRef: MatDialogRef<AddPurchaseOrderPaymentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseOrder,
    private purchaseOrderPaymentService: PurchaseOrderPaymentService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    private translationService: TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.paymentMethodsList();
    if (this.data.id) {
      this.paymentsForm.get('amount').setValue((this.data.totalAmount-this.data.totalPaidAmount));
      this.paymentsForm.get('purchaseOrderId').setValue(this.data.id);

    }
  }

  createForm() {
    this.paymentsForm = this.fb.group({
      id: [''],
      purchaseOrderId: [''],
      paymentDate: [new Date(), [Validators.required]],
      referenceNumber: [''],
      amount: ['', Validators.required],
      note: [''],
      attachmentData: [''],
      paymentMethod: [0, Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  fileEvent($event) {
    this.isReceiptDeleted = true;
    let files: File[] = $event.target.files;
    if (files.length == 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.paymentsForm.get('attachmentData').setValue(reader.result.toString());
    }
  }

  paymentMethodsList() {
    this.sub$.sink = this.purchaseOrderPaymentService.getPaymentMethod()
      .subscribe(f => this.paymentMethodslist = [...f]
      );
  }

  savePurchaseOrderPayment(): void {
    if (!this.paymentsForm.valid) {
      this.paymentsForm.markAllAsTouched();
      return;
    }
    const purchaseOrderpayment: PurchaseOrderPayment = this.paymentsForm.value;
    if (this.data.id) {
      this.purchaseOrderPaymentService.addPurchaseOrderPayments(purchaseOrderpayment).subscribe(() => {
        this.toastrService.success('Payment Add Successfully');
        this.dialogRef.close(true);
      });
    }
  }
}
