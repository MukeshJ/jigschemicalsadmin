import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentMethod } from '@core/domain-classes/payment-method';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderPayment } from '@core/domain-classes/sales-order-payment';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { SalesOrderPaymentService } from '../sales-order-payment.service';

@Component({
  standalone: false,
  selector: 'app-add-sales-order-payment',
  templateUrl: './add-sales-order-payment.component.html',
  styleUrls: ['./add-sales-order-payment.component.scss']
})
export class AddSalesOrderPaymentComponent  extends BaseComponent implements OnInit {
  sub$: any;

  paymentMethodslist: PaymentMethod[] = [];
  paymentsForm: FormGroup;
  isReceiptDeleted = false;
  constructor(
    public dialogRef: MatDialogRef<AddSalesOrderPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SalesOrder,
    private salesOrderPaymentService: SalesOrderPaymentService,
    // private purchaseOrderPaymentService: PurchaseOrderPaymentService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private translationService: TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.paymentMethodsList();
    if (this.data.id) {
      this.paymentsForm.patchValue(this.data);
      this.paymentsForm.get('amount').setValue((this.data.totalAmount - this.data.totalPaidAmount));
      this.paymentsForm.get('salesOrderId').setValue(this.data.id);

    }
  }

  createForm() {
    this.paymentsForm = this.fb.group({
      id: [''],
      salesOrderId: [''],
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
    this.sub$.sink = this.salesOrderPaymentService.getPaymentMethod()
      .subscribe(f => this.paymentMethodslist = [...f]
      );
  }

  saveSalesOrderPayment(): void {
    if (!this.paymentsForm.valid) {
      this.paymentsForm.markAllAsTouched();
      return;
    }
    const salesOrderpayment: SalesOrderPayment = this.paymentsForm.value;
    if (this.data.id) {
      this.salesOrderPaymentService.addSalesOrderPayments(salesOrderpayment).subscribe(() => {
        this.toastrService.success('Payment Add Successfully');
        this.dialogRef.close(true);
      });
    }
  }

}
