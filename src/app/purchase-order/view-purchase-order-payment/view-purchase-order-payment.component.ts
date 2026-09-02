import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order/purchase-order-payment';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderPaymentService } from '../purchase-order-payment.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { PaymentMethodPipe } from '../../shared/pipes/paymentMethod.pipe';
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-view-purchase-order-payment',
  templateUrl: './view-purchase-order-payment.component.html',
  styleUrls: ['./view-purchase-order-payment.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    HasClaimDirective,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    PaymentMethodPipe,
    CustomCurrencyPipe,
    UTCToLocalTime,
    TranslatePipe,
  ],
})
export class ViewPurchaseOrderPaymentComponent extends BaseComponent implements OnInit {
  dataSource = new MatTableDataSource<PurchaseOrderPayment>();
  isData: boolean = false;
  isDeleted = false;
  constructor(
    public dialogRef: MatDialogRef<ViewPurchaseOrderPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PurchaseOrder,
    private purchaseOrderPaymentService: PurchaseOrderPaymentService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.getAllPurchaseOrderPaymentById();
    }
  }

  displayedColumns: string[] = [
    'action',
    'paymentDate',
    'referenceNumber',
    'amount',
    'paymentMethod',
  ];
  footerToDisplayed = ['footer'];

  onCancel(): void {
    this.dialogRef.close(this.isDeleted);
  }

  getAllPurchaseOrderPaymentById() {
    this.purchaseOrderPaymentService
      .getAllPurchaseOrderPaymentById(this.data.id)
      .subscribe((data) => {
        this.dataSource = data;
        if (data.length == 0) {
          this.isData = true;
        }
      });
  }

  deletePayment(payment: PurchaseOrderPayment) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${payment.amount}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.purchaseOrderPaymentService
            .deletePurchaseOrderPayment(payment.id)
            .subscribe(() => {
              this.isDeleted = true;
              this.toastrService.success('Payment is deleted.');
              this.getAllPurchaseOrderPaymentById();
            });
        }
      });
  }
}
