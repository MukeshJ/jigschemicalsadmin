import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Supplier } from '@core/domain-classes/supplier';
import { Tax } from '@core/domain-classes/tax';
import { Unit } from '@core/domain-classes/unit';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { QuantitiesUnitPriceTaxPipe } from '@shared/pipes/quantities-unitprice-tax.pipe';
import { QuantitiesUnitPricePipe } from '@shared/pipes/quantities-unitprice.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SupplierLocalStore } from 'src/app/supplier/supplier-store';
import { PurchaseOrderService } from '../purchase-order.service';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { ChemicalLocalStore } from 'src/app/chemical/chemical-store';
import { Chemical } from '@core/domain-classes/chemical';
import { PackagingTypeService } from '@core/services/packaging-type.service';
import { PackagingType } from '@core/domain-classes/packaging-type';
import { environment } from '@environments/environment';
import { PurchaseOrderStatusEnum } from '@core/domain-classes/purchase-order/purchase-order-status';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order/purchase-order-resource-parameter';
import { PurchaseOrderAttachment } from '@core/domain-classes/purchase-order/purchase-order-attachment';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { PurchaseOrderItemTax } from '@core/domain-classes/purchase-order/purchase-order-item-tax';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { MatSelect, MatOption, MatLabel, MatSelectTrigger } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatDatepickerInput, MatDatepicker } from '@angular/material/datepicker';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { QuantitiesUnitPricePipe as QuantitiesUnitPricePipe_1 } from '../../shared/pipes/quantities-unitprice.pipe';
import { QuantitiesUnitPriceTaxPipe as QuantitiesUnitPriceTaxPipe_1 } from '../../shared/pipes/quantities-unitprice-tax.pipe';

@Component({
  selector: 'app-purchase-order-add-edit',
  templateUrl: './purchase-order-add-edit.component.html',
  styleUrls: ['./purchase-order-add-edit.component.scss'],
  providers: [ChemicalLocalStore, SupplierLocalStore],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatSelectTrigger,
    MatDivider,
    MatOption,
    MatDatepickerInput,
    MatDatepicker,
    MatLabel,
    MatRadioGroup,
    MatRadioButton,
    MatIconButton,
    MatIcon,
    MatCard,
    MatCardSubtitle,
    HasClaimDirective,
    RouterLink,
    CustomCurrencyPipe,
    UTCToLocalTime,
    TranslatePipe,
    QuantitiesUnitPricePipe_1,
    QuantitiesUnitPriceTaxPipe_1,
  ],
})
export class PurchaseOrderAddEditComponent extends BaseComponent {
  _validFileExtensions = environment.allowFileExtension;
  packagingTypes: PackagingType[] = [];
  taxes$: Observable<Tax[]>;
  purchaseOrderForm: UntypedFormGroup;
  chemical: Chemical[] = [];
  suppliers: Supplier[] = [];

  private readonly supplierStore = inject(SupplierLocalStore);

  private readonly chemicalStore = inject(ChemicalLocalStore);
  isLoading: boolean = false;
  isSupplierLoading: boolean = false;
  filterChemicalsMap: { [key: string]: Chemical[] } = {};
  unitsMap: { [key: string]: Unit[] } = {};
  taxsMap: { [key: string]: Tax[] } = {};
  totalBeforeDiscount: number = 0;
  totalAfterDiscount: number = 0;
  totalDiscount: number = 0;
  grandTotal: number = 0;
  totalTax: number = 0;
  timeoutclear: any;
  purchaseOrder: PurchaseOrder;
  isEdit: boolean = false;
  purchaseOrderResource: PurchaseOrderResourceParameter;
  purchaseOrderRequestList: PurchaseOrder[] = [];
  purchaseOrderAttachment: PurchaseOrderAttachment[] = [];

  get purchaseOrderItemsArray(): UntypedFormArray {
    return <UntypedFormArray>this.purchaseOrderForm.get('purchaseOrderItems');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private translationService: TranslationService,
    private taxService: TaxService,
    private route: ActivatedRoute,
    private quantitiesUnitPricePipe: QuantitiesUnitPricePipe,
    private quantitiesUnitPriceTaxPipe: QuantitiesUnitPriceTaxPipe,
    private packagingTypeService: PackagingTypeService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = true;
  }

  ngOnInit(): void {
    this.createPurchaseOrder();
    this.getPurchaseOrderRequest();
    this.supplierNameChangeValue();
    this.getNewPurchaseOrderNumber();
    this.getPurchaseOrderRequestList();
    this.getPurchaseOrderRequestChange();
    this.getPurchaseOrderRequestIdChange();
    this.getTaxes();
    this.getPackagingTypes();
  }

  getPurchaseOrderRequest() {
    this.sub$.sink = this.route.queryParamMap
      .pipe(map((params: ParamMap) => params.get('purchase-order-requestId')))
      .subscribe((c) => {
        if (c) this.getPurchaseOrderRequestById(c);
      });
  }

  getPurchaseOrderRequestList() {
    this.purchaseOrderService
      .getAllPurchaseOrder(this.purchaseOrderResource)
      .subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
        if (resp && resp.headers) {
          const paginationParam = JSON.parse(resp.headers.get('X-Pagination')) as ResponseHeader;
          this.purchaseOrderRequestList = [...resp.body];
        }
        this.cdr.detectChanges();
      });
  }
  getPurchaseOrderRequestChange() {
    this.purchaseOrderForm
      .get('purchaseOrderRequestOrderNumber')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((c) => {
        this.purchaseOrderResource.orderNumber = c;
        this.getPurchaseOrderRequestList();
      });
  }

  getPurchaseOrderRequestIdChange() {
    this.purchaseOrderForm.get('purchaseOrderRequestId').valueChanges.subscribe((c) => {
      this.getPurchaseOrderRequestById(c);
      // this.purchaseOrderResource.orderNumber='';
      // this.getPurchaseOrderRequestList();
    });
  }

  getPurchaseOrderRequestById(id: string) {
    this.purchaseOrderService.getPurchaseOrderById(id).subscribe((c: PurchaseOrder) => {
      if (c) {
        this.purchaseOrderForm.patchValue({
          purchaseOrderRequestOrderNumber: '',
          filerSupplier: '',
          deliveryDate: c.deliveryDate,
          poCreatedDate: c.poCreatedDate,
          deliveryStatus: c.deliveryStatus,
          supplierId: c.supplierId,
          packagingTypeId: c.packagingTypeId,
          supplierInvoiceNumber: c.supplierInvoiceNumber,
          note: c.note,
          termAndCondition: c.termAndCondition,
        });

        this.clearFormArray();

        c.purchaseOrderItems.forEach((item) => {
          this.purchaseOrderItemsArray.push(
            this.createPurchaseOrderItemPatch(this.purchaseOrderItemsArray.length, item),
          );
        });

        this.supplierStore
          .searchSuppliers('', { id: c.supplierId })
          .subscribe((suppliers) => {
            this.suppliers = [...(suppliers ?? [])];
            this.cdr.detectChanges();
          });

        this.getAllTotal();
      }
      this.cdr.detectChanges();
    });
  }
  clearFormArray() {
    while (this.purchaseOrderItemsArray.length !== 0) {
      this.purchaseOrderItemsArray.removeAt(0);
    }
  }

  getPackagingTypes() {
    this.packagingTypeService.getAll().subscribe((packagingTypes) => {
      this.packagingTypes = packagingTypes;
      this.cdr.detectChanges();
    });
  }

  getTaxes() {
    this.taxes$ = this.taxService.entities$;
  }

  createPurchaseOrder() {
    this.route.data.pipe().subscribe((purchaseOrderData: { purchaseorder: PurchaseOrder }) => {
      this.purchaseOrder = purchaseOrderData.purchaseorder;
      if (this.purchaseOrder) {
        this.isEdit = true;
        this.purchaseOrderForm = this.fb.group({
          purchaseOrderRequestId: [{ value: '', disabled: true }],
          purchaseOrderRequestOrderNumber: [{ value: '', disabled: true }],
          orderNumber: [this.purchaseOrder.orderNumber, [Validators.required]],
          filerSupplier: [''],
          deliveryDate: [this.purchaseOrder.deliveryDate, [Validators.required]],
          poCreatedDate: [this.purchaseOrder.poCreatedDate, [Validators.required]],
          supplierId: [this.purchaseOrder.supplierId, [Validators.required]],
          supplierInvoiceNumber: [this.purchaseOrder.supplierInvoiceNumber],
          note: [this.purchaseOrder.note],
          termAndCondition: [this.purchaseOrder.termAndCondition],
          packagingTypeId: [this.purchaseOrder.packagingTypeId],
          paymentStatus: [this.purchaseOrder.paymentStatus],
          isStockAtSupplierWarehouse: [this.purchaseOrder.isStockAtSupplierWarehouse],
          purchaseOrderItems: this.fb.array([]),
        });
        this.purchaseOrder.purchaseOrderItems.forEach((c) => {
          this.purchaseOrderItemsArray.push(
            this.createPurchaseOrderItemPatch(this.purchaseOrderItemsArray.length, c),
          );
        });
        this.getSuppliers();
        this.getAllTotal();
      } else {
        this.isEdit = false;
        this.getSuppliers();
        this.purchaseOrderForm = this.fb.group({
          purchaseOrderRequestId: [''],
          purchaseOrderRequestOrderNumber: [''],
          orderNumber: ['', [Validators.required]],
          filerSupplier: [''],
          deliveryDate: [new Date(), [Validators.required]],
          poCreatedDate: [new Date(), [Validators.required]],
          deliveryStatus: [1],
          supplierId: ['', [Validators.required]],
          supplierInvoiceNumber: [''],
          note: [''],
          termAndCondition: [''],
          packagingTypeId: ['', [Validators.required]],
          paymentStatus: [1],
          isStockAtSupplierWarehouse: [false],
          purchaseOrderItems: this.fb.array([]),
        });
        this.purchaseOrderItemsArray.push(
          this.createPurchaseOrderItem(this.purchaseOrderItemsArray.length),
        );
      }
      this.cdr.detectChanges();
    });
  }

  onAddAnotherChemical() {
    this.purchaseOrderItemsArray.push(
      this.createPurchaseOrderItem(this.purchaseOrderItemsArray.length),
    );
  }

  createPurchaseOrderItemPatch(index: number, purchaseOrderItem: PurchaseOrderItem) {
    const taxs = purchaseOrderItem.purchaseOrderItemTaxes.map((c) => c.taxId);
    const formGroup = this.fb.group({
      chemicalId: [purchaseOrderItem.chemicalId, [Validators.required]],
      filterChemicalValue: [''],
      unitPrice: [purchaseOrderItem.unitPrice, [Validators.required]],
      quantity: [purchaseOrderItem.quantity, [Validators.required]],
      taxValue: [taxs],
      unitId: [purchaseOrderItem.chemical.unitId, [Validators.required]],
      discountPercentage: [purchaseOrderItem.discountPercentage],
    });
    this.unitsMap[index] = [...this.route.snapshot.data['units']];
    this.taxsMap[index] = [...this.route.snapshot.data['taxs']];
    this.filterChemicalsMap[index.toString()] = [purchaseOrderItem.chemical];
    this.getChemicalByNameValue(formGroup, index);
    return formGroup;
  }

  createPurchaseOrderItem(index: number) {
    const formGroup = this.fb.group({
      chemicalId: ['', [Validators.required]],
      filterChemicalValue: [''],
      unitPrice: [0, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      taxValue: [null],
      unitId: [null],
      discountPercentage: [0, [Validators.min(0)]],
    });
    this.unitsMap[index] = [...this.route.snapshot.data['units']];
    this.taxsMap[index] = [...this.route.snapshot.data['taxs']];
    this.filterChemicalsMap[index.toString()] = [...this.route.snapshot.data['chemicals']];
    this.getChemicalByNameValue(formGroup, index);
    return formGroup;
  }

  getChemicalByNameValue(formGroup: UntypedFormGroup, index: number) {
    if (this.purchaseOrder) {
      this.getChemicals(index);
    }
    this.sub$.sink = formGroup
      .get('filterChemicalValue')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => this.chemicalStore.searchChemicals(c)),
      )
      .subscribe(
        (chemicals: Chemical[]) => {
          this.filterChemicalsMap[index.toString()] = [...(chemicals ?? [])];
        },
        (err) => {},
      );
  }
  getAllTotal() {
    let purchaseOrderItems = this.purchaseOrderForm.get('purchaseOrderItems').value;
    this.totalBeforeDiscount = 0;
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach((po) => {
        if (po.unitPrice && po.quantity) {
          const totalBeforeDiscount =
            this.totalBeforeDiscount +
            parseFloat(this.quantitiesUnitPricePipe.transform(po.quantity, po.unitPrice));
          this.totalBeforeDiscount = parseFloat(totalBeforeDiscount.toFixed(2));
          const gradTotal =
            this.grandTotal +
            parseFloat(
              this.quantitiesUnitPricePipe.transform(
                po.quantity,
                po.unitPrice,
                po.discountPercentage,
                po.taxValue,
                this.taxsMap[0],
              ),
            );
          this.grandTotal = parseFloat(gradTotal.toFixed(2));
          const totalTax =
            this.totalTax +
            parseFloat(
              this.quantitiesUnitPriceTaxPipe.transform(
                po.quantity,
                po.unitPrice,
                po.discountPercentage,
                po.taxValue,
                this.taxsMap[0],
              ),
            );
          this.totalTax = parseFloat(totalTax.toFixed(2));
          const totalDiscount =
            this.totalDiscount +
            parseFloat(
              this.quantitiesUnitPriceTaxPipe.transform(
                po.quantity,
                po.unitPrice,
                po.discountPercentage,
              ),
            );
          this.totalDiscount = parseFloat(totalDiscount.toFixed(2));
        }
      });
    }
  }

  onUnitPriceChange() {
    this.getAllTotal();
  }
  onQuantityChange() {
    this.getAllTotal();
  }
  onDiscountChange() {
    this.getAllTotal();
  }
  onTaxSelectionChange() {
    this.getAllTotal();
  }

  getUnitNameById(unitId: string | number | null, index: number): string {
    if (unitId === null || unitId === undefined || unitId === '') {
      return '';
    }

    const unit = this.unitsMap[index]?.find((u: Unit) => String(u.id) === String(unitId));
    return unit ? unit.name : '';
  }

  onRemovePurchaseOrderItem(index: number) {
    this.purchaseOrderItemsArray.removeAt(index);
    this.purchaseOrderItemsArray.controls.forEach((c: UntypedFormGroup, index: number) => {
      const chemicalId = c.get('chemicalId').value;
      if (chemicalId) {
        this.purchaseOrder.purchaseOrderItems.map((pi) => {
          if (pi.chemical.id === chemicalId) {
            if (this.chemical.find((c) => c.id === chemicalId)) {
              this.getChemicals(index);
            } else {
              this.getChemicals(index, chemicalId);
            }
          }
        });
      } else {
        this.getChemicals(index);
      }
    });
    this.getAllTotal();
  }

  getChemicals(index: number, chemicalId?: string) {
    if (this.chemical.length === 0 || chemicalId) {
      this.chemicalStore
        .searchChemicals('', chemicalId ? { chemicalId } : {})
        .subscribe(
          (chemicals: Chemical[]) => {
            this.chemical = [...(chemicals ?? [])];
            this.filterChemicalsMap[index.toString()] = [...this.chemical];
          },
          (err) => {},
        );
    } else {
      this.filterChemicalsMap[index.toString()] = [...this.chemical];
    }
  }

  onChemicalSelectionChange(value: any, index: number) {
    const chemical = this.filterChemicalsMap[index].find((c: Chemical) => c.id === value.value);
    this.purchaseOrderItemsArray.controls[index].patchValue({
      filterChemicalValue: '',
      unitPrice: '',
    });
    this.purchaseOrderItemsArray.controls[index].patchValue({
      unitId: chemical.unitId,
    });
  }

  getNewPurchaseOrderNumber() {
    if (!this.purchaseOrder) {
      this.purchaseOrderService.getNewPurchaseOrderNumber(true).subscribe((purchaseOrder) => {
        this.purchaseOrderForm.patchValue({
          orderNumber: purchaseOrder.orderNumber,
        });
        this.cdr.detectChanges();
      });
    }
  }

  supplierNameChangeValue() {
    this.sub$.sink = this.purchaseOrderForm
      .get('filerSupplier')
      .valueChanges.pipe(
        tap((c) => (this.isSupplierLoading = true)),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => this.supplierStore.searchSuppliers(c)),
      )
      .subscribe(
        (suppliers: Supplier[]) => {
          this.isSupplierLoading = false;
          this.suppliers = [...(suppliers ?? [])];
        },
        (err) => {
          this.isSupplierLoading = false;
        },
      );
  }

  getSuppliers() {
    const overrides = this.purchaseOrder
      ? { id: this.purchaseOrder.supplierId }
      : {};
    this.supplierStore.searchSuppliers('', overrides).subscribe((suppliers) => {
      this.suppliers = [...(suppliers ?? [])];
      this.cdr.detectChanges();
    });
  }

  onPurchaseOrderSubmit() {
    if (!this.purchaseOrderForm.valid) {
      this.purchaseOrderForm.markAllAsTouched();
    } else {
      if (
        this.purchaseOrder &&
        this.purchaseOrder.purchaseOrderStatus === PurchaseOrderStatusEnum.Return
      ) {
        this.toastrService.error(
          this.translationService.getValue('RETURN_PURCHASE_ORDER_CANT_BE_EDITED'),
        );
        return;
      }
      this.isLoading = true;
      const purchaseOrder = this.buildPurchaseOrder();
      if (purchaseOrder.id) {
        this.purchaseOrderService.updatePurchaseOrder(purchaseOrder).subscribe(
          (c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success(
              this.translationService.getValue('PURCHASE_ORDER_SAVED_SUCCESSFULLY'),
            );
            this.router.navigate(['/purchase-order/list']);
          },
          (err) => {
            this.isLoading = false;
          },
        );
      } else {
        this.purchaseOrderService.addPurchaseOrder(purchaseOrder).subscribe(
          (c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success(
              this.translationService.getValue('PURCHASE_ORDER_SAVED_SUCCESSFULLY'),
            );
            this.router.navigate(['/purchase-order/list']);
          },
          (err) => {
            this.isLoading = false;
          },
        );
      }
    }
  }

  buildPurchaseOrder() {
    const purchaseOrder: PurchaseOrder = {
      id: this.purchaseOrder ? this.purchaseOrder.id : '',
      orderNumber: this.purchaseOrderForm.get('orderNumber').value,
      deliveryDate: this.purchaseOrderForm.get('deliveryDate').value,
      poCreatedDate: this.purchaseOrderForm.get('poCreatedDate').value,
      supplierId: this.purchaseOrderForm.get('supplierId').value,
      totalAmount: this.grandTotal,
      totalDiscount: this.totalDiscount,
      totalTax: this.totalTax,
      isPurchaseOrderRequest: false,
      note: this.purchaseOrderForm.get('note').value,
      termAndCondition: this.purchaseOrderForm.get('termAndCondition').value,
      purchaseOrderItems: [],
      purchaseOrderStatus: PurchaseOrderStatusEnum.Not_Return,
      deliveryStatus: DeliveryStatusEnum.UnDelivery,
      packagingTypeId: this.purchaseOrderForm.get('packagingTypeId').value,
      isStockAtSupplierWarehouse: this.purchaseOrderForm.get('isStockAtSupplierWarehouse').value,
      supplierInvoiceNumber: this.purchaseOrderForm.get('supplierInvoiceNumber').value,
      paymentStatus: this.purchaseOrderForm.get('paymentStatus').value,
      purchaseOrderAttachments: [],
    };

    this.purchaseOrderAttachment.forEach((attachement) => {
      purchaseOrder.purchaseOrderAttachments.push({
        documentData: attachement.documentData,
        name: attachement.name,
      });
    });

    const purchaseOrderItems = this.purchaseOrderForm.get('purchaseOrderItems').value;
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach((po) => {
        purchaseOrder.purchaseOrderItems.push({
          discount: parseFloat(
            this.quantitiesUnitPriceTaxPipe.transform(
              po.quantity,
              po.unitPrice,
              po.discountPercentage,
            ),
          ),
          discountPercentage: po.discountPercentage,
          chemicalId: po.chemicalId,
          quantity: po.quantity,
          taxValue: parseFloat(
            this.quantitiesUnitPriceTaxPipe.transform(
              po.quantity,
              po.unitPrice,
              po.discountPercentage,
              po.taxValue,
              this.taxsMap[0],
            ),
          ),
          unitPrice: parseFloat(po.unitPrice),
          purchaseOrderItemTaxes: [
            ...(po.taxValue
              ? po.taxValue.map((element) => {
                  const purchaseOrderItemTaxes: PurchaseOrderItemTax = {
                    taxId: element,
                  };
                  return purchaseOrderItemTaxes;
                })
              : []),
          ],
        });
      });
    }
    return purchaseOrder;
  }

  fileEvent($event) {
    let files: File[] = $event.target.files;
    if (files.length == 0) {
      return;
    }
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (this.Validate(file.name)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.purchaseOrderAttachment.push({
            name: file.name,
            documentData: reader.result.toString(),
          });
        };
      }
    }
  }

  removeAttachemet(fileName) {
    this.purchaseOrderAttachment = this.purchaseOrderAttachment.filter((c) => c.name != fileName);
  }

  Validate(fileName: string) {
    var sFileName = fileName;
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < this._validFileExtensions.length; j++) {
        var sCurExtension = this._validFileExtensions[j];
        if (
          sFileName
            .substr(sFileName.length - sCurExtension.length, sCurExtension.length)
            .toLowerCase() == sCurExtension.toLowerCase()
        ) {
          blnValid = true;
          break;
        }
      }
      if (!blnValid) {
        this.toastrService.error(
          sFileName +
            this.translationService.getValue('IS_INVALID_ALLOWED_EXTENSIONS_ARE') +
            this._validFileExtensions.join(', '),
        );
        return false;
      }
    }
    return true;
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
}
