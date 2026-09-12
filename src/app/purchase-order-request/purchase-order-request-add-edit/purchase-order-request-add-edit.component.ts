import { Component, inject } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Chemical } from '@core/domain-classes/chemical';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { PackagingType } from '@core/domain-classes/packaging-type';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { PurchaseOrderItemTax } from '@core/domain-classes/purchase-order/purchase-order-item-tax';
import { PurchaseOrderStatusEnum } from '@core/domain-classes/purchase-order/purchase-order-status';
import { Supplier } from '@core/domain-classes/supplier';
import { Tax } from '@core/domain-classes/tax';
import { Unit } from '@core/domain-classes/unit';
import { CommonService } from '@core/services/common.service';
import { PackagingTypeService } from '@core/services/packaging-type.service';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { QuantitiesUnitPriceTaxPipe } from '@shared/pipes/quantities-unitprice-tax.pipe';
import { QuantitiesUnitPricePipe } from '@shared/pipes/quantities-unitprice.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalLocalStore } from 'src/app/chemical/chemical-store';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { SupplierLocalStore } from 'src/app/supplier/supplier-store';
import { MatDatepickerInput, MatDatepicker } from '@angular/material/datepicker';
import { MatSelect, MatOption, MatLabel } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { QuantitiesUnitPricePipe as QuantitiesUnitPricePipe_1 } from '../../shared/pipes/quantities-unitprice.pipe';
import { QuantitiesUnitPriceTaxPipe as QuantitiesUnitPriceTaxPipe_1 } from '../../shared/pipes/quantities-unitprice-tax.pipe';

@Component({
  selector: 'app-purchase-order-request-add-edit',
  templateUrl: './purchase-order-request-add-edit.component.html',
  styleUrls: ['./purchase-order-request-add-edit.component.scss'],
  providers: [ChemicalLocalStore, SupplierLocalStore],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepicker,
    MatSelect,
    MatDivider,
    MatOption,
    MatLabel,
    MatIconButton,
    MatIcon,
    HasClaimDirective,
    RouterLink,
    CustomCurrencyPipe,
    TranslatePipe,
    QuantitiesUnitPricePipe_1,
    QuantitiesUnitPriceTaxPipe_1,
  ],
})
export class PurchaseOrderRequestAddEditComponent extends BaseComponent {
  taxes$: Observable<Tax[]>;
  purchaseOrderForm: UntypedFormGroup;
  chemicals: Chemical[] = [];
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
  isEdit: boolean = false;
  purchaseOrder: PurchaseOrder;
  packagingTypes: PackagingType[] = [];

  get purchaseOrderItemsArray(): UntypedFormArray {
    return <UntypedFormArray>this.purchaseOrderForm.get('purchaseOrderItems');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private translationService: TranslationService,
    private commonService: CommonService,
    private taxService: TaxService,
    private route: ActivatedRoute,
    private quantitiesUnitPricePipe: QuantitiesUnitPricePipe,
    private quantitiesUnitPriceTaxPipe: QuantitiesUnitPriceTaxPipe,
    private packagingTypeService: PackagingTypeService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createPurchaseOrder();
    this.supplierNameChangeValue();
    this.getNewPurchaseOrderNumber();
    this.getTaxes();
    this.getPackagingTypes();
  }

  getPackagingTypes() {
    this.packagingTypeService.getAll().subscribe((packagingTypes) => {
      this.packagingTypes = packagingTypes;
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
          orderNumber: [this.purchaseOrder.orderNumber, [Validators.required]],
          filerSupplier: [''],
          deliveryDate: [this.purchaseOrder.deliveryDate, [Validators.required]],
          poCreatedDate: [this.purchaseOrder.poCreatedDate, [Validators.required]],
          deliveryStatus: [this.purchaseOrder.deliveryStatus],
          supplierId: [this.purchaseOrder.supplierId, [Validators.required]],
          packagingTypeId: [this.purchaseOrder.packagingTypeId],
          note: [this.purchaseOrder.note],
          paymentStatus: [this.purchaseOrder.paymentStatus],
          termAndCondition: [this.purchaseOrder.termAndCondition],
          supplierInvoiceNumber: [this.purchaseOrder.supplierInvoiceNumber],
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
          orderNumber: ['', [Validators.required]],
          filerSupplier: [''],
          deliveryDate: [new Date(), [Validators.required]],
          poCreatedDate: [new Date(), [Validators.required]],
          deliveryStatus: [1],
          supplierId: ['', [Validators.required]],
          note: [''],
          termAndCondition: [''],
          packagingTypeId: ['', [Validators.required]],
          paymentStatus: [1],
          supplierInvoiceNumber: [''],
          purchaseOrderItems: this.fb.array([]),
        });
        this.purchaseOrderItemsArray.push(
          this.createPurchaseOrderItem(this.purchaseOrderItemsArray.length),
        );
      }
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
      unitId: [{ value: purchaseOrderItem.chemical.unitId, disabled: true }, [Validators.required]],
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
      unitId: [{ value: null, disabled: true }],
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

  onRemovePurchaseOrderItem(index: number) {
    this.purchaseOrderItemsArray.removeAt(index);
    this.getAllTotal();
  }

  getChemicals(index: number) {
    if (this.chemicals.length === 0) {
      this.chemicalStore.searchChemicals('').subscribe(
        (chemicals: Chemical[]) => {
          this.chemicals = [...(chemicals ?? [])];
          this.filterChemicalsMap[index.toString()] = [...this.chemicals];
        },
        (err) => {},
      );
    } else {
      this.filterChemicalsMap[index.toString()] = [...this.chemicals];
    }
  }

  onChemicalSelectionChange(value: any, index: number) {
    const chemical = this.filterChemicalsMap[index].find((c: Chemical) => c.id === value.value);
    this.purchaseOrderItemsArray.controls[index].patchValue({
      filterChemicalValue: '',
    });
    this.purchaseOrderItemsArray.controls[index].patchValue({
      unitId: chemical.unitId,
    });
    // if (chemical.chemicalTaxes.length) {
    //   this.purchaseOrderItemsArray.controls[index].patchValue({
    //     taxValue: chemical.chemicalTaxes.map(c => c.taxId)
    //   });
    // }
  }

  getNewPurchaseOrderNumber() {
    if (!this.purchaseOrder) {
      this.purchaseOrderService.getNewPurchaseOrderNumber(false).subscribe((purchaseOrder) => {
        this.purchaseOrderForm.patchValue({
          orderNumber: purchaseOrder.orderNumber,
        });
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
    });
  }

  onPurchaseOrderSubmit() {
    if (!this.purchaseOrderForm.valid) {
      this.purchaseOrderForm.markAllAsTouched();
    } else {
      if (
        this.purchaseOrder &&
        this.purchaseOrder.purchaseOrderStatus === PurchaseOrderStatusEnum.Not_Return
      ) {
        this.toastrService.error("Purchase Order can't edit becuase it's already approved.");
        return;
      }
      this.isLoading = true;
      const purchaseOrder = this.buildPurchaseOrder();
      if (purchaseOrder.id) {
        this.purchaseOrderService.updatePurchaseOrder(purchaseOrder).subscribe(
          (c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success('Purchase order added successfully.');
            this.router.navigate(['/purchase-order-request/list']);
          },
          (err) => {
            this.isLoading = false;
          },
        );
      } else {
        this.purchaseOrderService.addPurchaseOrder(purchaseOrder).subscribe(
          (c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success('Purchase order added successfully.');
            this.router.navigate(['/purchase-order-request/list']);
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
      isPurchaseOrderRequest: true,
      note: this.purchaseOrderForm.get('note').value,
      termAndCondition: this.purchaseOrderForm.get('termAndCondition').value,
      purchaseOrderItems: [],
      purchaseOrderStatus: PurchaseOrderStatusEnum.Not_Return,
      deliveryStatus: DeliveryStatusEnum.UnDelivery,
      packagingTypeId: this.purchaseOrderForm.get('packagingTypeId').value,
      isStockAtSupplierWarehouse: true,
      supplierInvoiceNumber: this.purchaseOrderForm.get('supplierInvoiceNumber').value,
      paymentStatus: this.purchaseOrderForm.get('paymentStatus').value,
      purchaseOrderAttachments: [],
    };

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
          purchaseOrderItemTaxes: po.taxValue
            ? [
                ...po.taxValue.map((element) => {
                  const purchaseOrderItemTaxes: PurchaseOrderItemTax = {
                    taxId: element,
                  };
                  return purchaseOrderItemTaxes;
                }),
              ]
            : [],
        });
      });
    }
    return purchaseOrder;
  }
}
