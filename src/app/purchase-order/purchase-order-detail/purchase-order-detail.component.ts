import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { SecurityService } from '@core/security/security.service';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderService } from '../purchase-order.service';
import { Location, NgClass } from '@angular/common';
import { PurchaseOrderAttachment } from '@core/domain-classes/purchase-order/purchase-order-attachment';
import { ToastrService } from 'ngx-toastr';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { PurchaseOrderInvoiceComponent } from '../../shared/purchase-order-invoice/purchase-order-invoice.component';
import { PaymentStatusPipe } from '../../shared/pipes/purchase-order-paymentStatus.pipe';
import { PaymentMethodPipe } from '../../shared/pipes/paymentMethod.pipe';
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss'],
  imports: [
    HasClaimDirective,
    NgClass,
    MatCard,
    MatCardSubtitle,
    PurchaseOrderInvoiceComponent,
    PaymentStatusPipe,
    PaymentMethodPipe,
    CustomCurrencyPipe,
    UTCToLocalTime,
    TranslatePipe,
  ],
})
export class PurchaseOrderDetailComponent extends BaseComponent {
  currentDate: Date = new Date();
  quantitesErrormsg: string = '';
  errorMsg: string = '';
  companyProfile: CompanyProfile;
  isLoading = false;
  purchaseOrder = signal<PurchaseOrder | null>(null);
  purchaseOrderItems: PurchaseOrderItem[];
  purchaseOrderReturnsItems: PurchaseOrderItem[];
  purchaseOrderForInvoice: PurchaseOrder;
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private routes: ActivatedRoute,
    private clonerService: ClonerService,
    private securityService: SecurityService,
    private location: Location,
    private translationService: TranslationService,
    private toastrService: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getSupplierOrderById();
    this.subScribeCompanyProfile();
  }

  getSupplierOrderById() {
    this.sub$.sink = this.routes.params.subscribe((c: Params) => {
      this.getPurchaseOrderById(c['id']);
    });
  }

  subScribeCompanyProfile() {
    this.securityService.companyProfile.subscribe((data) => {
      this.companyProfile = data;
    });
  }

  getPurchaseOrderById(id: string) {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderById(id).subscribe(
      (c: PurchaseOrder) => {
        this.purchaseOrder.set(this.clonerService.deepClone<PurchaseOrder>(c));
        const po = this.purchaseOrder();
        po.totalQuantity = po.purchaseOrderItems
          .map((item) => (item.status == 1 ? -1 * item.quantity : item.quantity))
          .reduce((prev, next) => prev + next, 0);
        this.purchaseOrderItems = po.purchaseOrderItems.filter(
          (c) => c.status == 0,
        );
        this.purchaseOrderReturnsItems = po.purchaseOrderItems.filter(
          (c) => c.status == 1,
        );
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      },
    );
  }

  generateInvoice() {
    let poForInvoice = this.clonerService.deepClone<PurchaseOrder>(this.purchaseOrder());
    poForInvoice.purchaseOrderItems.map((c) => {
      c.unitName = c.chemical?.unitName;
      return c;
    });
    this.purchaseOrderForInvoice = poForInvoice;
  }

  downloadAttachment(attachement: PurchaseOrderAttachment) {
    this.sub$.sink = this.purchaseOrderService.downloadAttachment(attachement.id).subscribe(
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
