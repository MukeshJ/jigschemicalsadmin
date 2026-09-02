import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { SecurityService } from '@core/security/security.service';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderService } from '../purchase-order.service';
import { Location } from '@angular/common';
import { PurchaseOrderAttachment } from '@core/domain-classes/purchase-order/purchase-order-attachment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent extends BaseComponent {

  currentDate: Date = new Date();
  quantitesErrormsg: string = '';
  errorMsg: string = '';
  companyProfile: CompanyProfile;
  isLoading = false;
  purchaseOrder: PurchaseOrder = null;
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
    private toastrService: ToastrService) {
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
    this.securityService.companyProfile.subscribe(data => {
      this.companyProfile = data;
    });
  }

  getPurchaseOrderById(id: string) {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderById(id)
      .subscribe((c: PurchaseOrder) => {
        this.purchaseOrder = this.clonerService.deepClone<PurchaseOrder>(c);
        this.purchaseOrder.totalQuantity = this.purchaseOrder.purchaseOrderItems.map(item => item.status == 1 ? -1 * item.quantity : item.quantity).reduce((prev, next) => prev + next);
        this.purchaseOrderItems = this.purchaseOrder.purchaseOrderItems.filter(c => c.status == 0);
        this.purchaseOrderReturnsItems = this.purchaseOrder.purchaseOrderItems.filter(c => c.status == 1);
        this.isLoading = false;
      }, (err) => {
        this.isLoading = false;
      });
  }

  generateInvoice() {
    let poForInvoice = this.clonerService.deepClone<PurchaseOrder>(this.purchaseOrder);
    poForInvoice.purchaseOrderItems.map(c => {
      c.unitName = c.chemical?.unitName;
      return c;
    })
    this.purchaseOrderForInvoice = poForInvoice;
  }

  downloadAttachment(attachement: PurchaseOrderAttachment) {
    this.sub$.sink = this.purchaseOrderService.downloadAttachment(attachement.id)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            this.downloadFile(event, attachement.name);
          }
        },
        (error) => {
          this.toastrService.error(this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'));
        }
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

