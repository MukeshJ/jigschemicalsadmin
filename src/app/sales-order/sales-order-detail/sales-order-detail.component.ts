import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { SecurityService } from '@core/security/security.service';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { SalesOrderService } from '../sales-order.service';
import { Location, NgClass } from '@angular/common';
import { SalesOrderAttachment } from '@core/domain-classes/sales-order-attachment';
import { ToastrService } from 'ngx-toastr';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { SalesOrderInvoiceComponent } from '../../shared/sales-order-invoice/sales-order-invoice.component';
import { PaymentStatusPipe } from '../../shared/pipes/purchase-order-paymentStatus.pipe';
import { PaymentMethodPipe } from '../../shared/pipes/paymentMethod.pipe';
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-order-detail',
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.scss'],
  imports: [
    HasClaimDirective,
    NgClass,
    MatCard,
    MatCardSubtitle,
    SalesOrderInvoiceComponent,
    PaymentStatusPipe,
    PaymentMethodPipe,
    CustomCurrencyPipe,
    UTCToLocalTime,
    TranslatePipe,
  ],
})
export class SalesOrderDetailComponent extends BaseComponent {
  currentDate: Date = new Date();
  quantitesErrormsg: string = '';
  errorMsg: string = '';
  companyProfile: CompanyProfile;
  isLoading = false;
  salesOrder = signal<SalesOrder | null>(null);
  salesOrderItems: SalesOrderItem[];
  salesOrderReturnsItems: SalesOrderItem[];
  salesOrderForInvoice: SalesOrder;
  constructor(
    private salesOrderService: SalesOrderService,
    private routes: ActivatedRoute,
    private clonerService: ClonerService,
    private location: Location,
    private securityService: SecurityService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCustomerOrderById();
    this.subScribeCompanyProfile();
  }

  getCustomerOrderById() {
    this.sub$.sink = this.routes.params.subscribe((c: Params) => {
      this.getSalesOrderById(c['id']);
    });
  }

  subScribeCompanyProfile() {
    this.securityService.companyProfile.subscribe((data) => {
      this.companyProfile = data;
    });
  }

  getSalesOrderById(id: string) {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderById(id).subscribe(
      (c: SalesOrder) => {
        this.salesOrder.set(this.clonerService.deepClone<SalesOrder>(c));
        this.salesOrder().totalQuantity = this.salesOrder().salesOrderItems
          .map((item) => (item.status == 1 ? -1 * item.quantity : item.quantity))
          .reduce((prev, next) => prev + next, 0);
        this.salesOrderItems = this.salesOrder().salesOrderItems.filter((c) => c.status == 0);
        this.salesOrderReturnsItems = this.salesOrder().salesOrderItems.filter((c) => c.status == 1);
        this.isLoading = false;
        // Show the invoice section as soon as the order loads, instead of
        // waiting for the user to click "Generate Invoice" first.
        this.generateInvoice();
      },
      (err) => {
        this.isLoading = false;
      },
    );
  }

  generateInvoice() {
    let soForInvoice = this.clonerService.deepClone<SalesOrder>(this.salesOrder());
    soForInvoice.salesOrderItems.map((c) => {
      c.unitName = c.chemical?.unitName;
      return c;
    });
    this.salesOrderForInvoice = soForInvoice;
  }

  // calulateTax() {
  //   const totalQuantity = this.purchaseOrder.totalQuantity;
  //   const unitPrice = this.purchaseOrder.pricePerUnit;;
  //   const tax = this.purchaseOrder.tax;
  //   const totalAmountWithTax = totalQuantity * unitPrice;
  //   let totalAmount = 0;
  //   if (tax && tax !== 0) {
  //     totalAmount = totalAmountWithTax + (totalAmountWithTax * tax) / 100;
  //     totalAmount = parseFloat(totalAmount.toFixed(2));
  //   } else {
  //     if (totalAmountWithTax) {
  //       totalAmount = totalAmountWithTax;
  //     } else {
  //       totalAmount = 0;
  //     }
  //   }
  //   return totalAmount;
  // }

  // downloadAttachment(attachement: PurchaseOrderAttachment) {
  //   this.sub$.sink = this.purchaseOrderService.downloadAttachment(attachement.id)
  //     .subscribe(
  //       (event) => {
  //         if (event.type === HttpEventType.Response) {
  //           this.downloadFile(event, attachement.name);
  //         }
  //       },
  //       (error) => {
  //         this.toastrService.error(this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'));
  //       }
  //     );
  // }

  downloadAttachment(attachement: SalesOrderAttachment) {
    this.sub$.sink = this.salesOrderService.downloadAttachment(attachement.id).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          this.downloadFile(event, attachement.name);
        }
      },
      (error) => {
        this.toastrService.error(
          this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'),
        );
      },
    );
  }

  private downloadFile(data: HttpResponse<Blob>, name: string) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  cancel() {
    this.location.back();
  }
}
