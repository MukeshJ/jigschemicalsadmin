import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { PurchaseOrderItemTax } from '@core/domain-classes/purchase-order/purchase-order-item-tax';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order/purchase-order-resource-parameter';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { Tax } from '@core/domain-classes/tax';
import { Unit } from '@core/domain-classes/unit';
import { ClonerService } from '@core/services/clone.service';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { QuantitiesUnitPriceTaxPipe } from '@shared/pipes/quantities-unitprice-tax.pipe';
import { QuantitiesUnitPricePipe } from '@shared/pipes/quantities-unitprice.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Location, NgIf, NgFor } from '@angular/common';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { PurchaseOrderStatusEnum } from '@core/domain-classes/purchase-order/purchase-order-status';
import { PackagingTypeService } from '@core/services/packaging-type.service';
import { PackagingType } from '@core/domain-classes/packaging-type';
import { MatSelect, MatOption, MatLabel } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { MatDatepickerInput, MatDatepicker } from '@angular/material/datepicker';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { QuantitiesUnitPricePipe as QuantitiesUnitPricePipe_1 } from '../../shared/pipes/quantities-unitprice.pipe';
import { QuantitiesUnitPriceTaxPipe as QuantitiesUnitPriceTaxPipe_1 } from '../../shared/pipes/quantities-unitprice-tax.pipe';

@Component({
  selector: 'app-purchase-order-return',
  templateUrl: './purchase-order-return.component.html',
  styleUrls: ['./purchase-order-return.component.scss'],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe],
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatDivider,
    NgFor,
    MatOption,
    MatDatepickerInput,
    MatDatepicker,
    MatLabel,
    MatIconButton,
    MatIcon,
    HasClaimDirective,
    MatProgressSpinner,
    CustomCurrencyPipe,
    TranslatePipe,
    QuantitiesUnitPricePipe_1,
    QuantitiesUnitPriceTaxPipe_1,
  ],
})
export class PurchaseOrderReturnComponent extends BaseComponent {
  taxes$: Observable<Tax[]>;
  purchaseOrderForm: UntypedFormGroup;
  purchaseOrderReturnForm: UntypedFormGroup;
  chemicals: Chemical[] = [];
  suppliers: Supplier[] = [];
  suppliersForSearch: Supplier[] = [];
  supplierResource: SupplierResourceParameter;
  purchaseResouce: PurchaseOrderResourceParameter;
  chemicalResource: ChemicalResourceParameter;
  purchaseorders: PurchaseOrder[] = [];
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
  purchaseOrderRequestList: PurchaseOrder[] = [];
  packagingTypes: PackagingType[] = [];
  purchaseOrderResource: PurchaseOrderResourceParameter;

  get purchaseOrderItemsArray(): UntypedFormArray {
    return <UntypedFormArray>this.purchaseOrderForm.get('purchaseOrderItems');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private supplierService: SupplierService,
    private toastrService: ToastrService,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private translationService: TranslationService,
    private taxService: TaxService,
    private chemicalService: ChemicalService,
    private route: ActivatedRoute,
    private quantitiesUnitPricePipe: QuantitiesUnitPricePipe,
    private quantitiesUnitPriceTaxPipe: QuantitiesUnitPriceTaxPipe,
    private location: Location,
    private cloneService: ClonerService,
    private packagingTypeService: PackagingTypeService,
  ) {
    super();
    this.supplierResource = new SupplierResourceParameter();
    this.purchaseResouce = new PurchaseOrderResourceParameter();
    this.chemicalResource = new ChemicalResourceParameter();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = true;
  }

  ngOnInit(): void {
    this.createPurchaseOrder();
    this.getTaxes();
    this.getPackagingTypes();
  }

  getPackagingTypes() {
    this.packagingTypeService.getAll().subscribe((packagingTypes) => {
      this.packagingTypes = packagingTypes;
    });
  }
  onFilterValue(filterValue: any) {
    console.log(filterValue);
  }

  getTaxes() {
    this.taxes$ = this.taxService.entities$;
  }

  createPurchaseOrderReturnOrder() {
    this.purchaseOrderReturnForm = this.fb.group({
      orderNumber: [''],
      filerSupplier: [''],
      supplierId: [''],
      purchaseOrderId: [''],
      filerPurchaseOrder: [''],
      packagingTypeId: [''],
    });
    this.getSuppliers();
    this.supplierNameForSearchChangeValue();
    this.subscribeSupplierChangeEvent();
    this.subscribePurchaseOrderFilterChangeEvent();
    this.onPurchaseOrderChange();
  }

  subscribeSupplierChangeEvent() {
    this.purchaseOrderReturnForm
      .get('supplierId')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.purchaseResouce.supplierId = c;
          this.purchaseResouce.status = PurchaseOrderStatusEnum.Not_Return;
          return this.purchaseOrderService.getAllPurchaseOrder(this.purchaseResouce);
        }),
      )
      .subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
        if (resp && resp.headers) {
          this.purchaseorders = [...resp.body];
        }
      });
  }

  subscribePurchaseOrderFilterChangeEvent() {
    this.purchaseOrderReturnForm
      .get('filerPurchaseOrder')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.purchaseResouce.orderNumber = c;
          return this.purchaseOrderService.getAllPurchaseOrder(this.purchaseResouce);
        }),
      )
      .subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
        if (resp && resp.headers) {
          this.purchaseorders = [...resp.body];
        }
      });
  }

  clearFormArray() {
    while (this.purchaseOrderItemsArray.length !== 0) {
      this.purchaseOrderItemsArray.removeAt(0);
    }
  }

  onPurchaseOrderChange() {
    this.purchaseOrderReturnForm.get('purchaseOrderId').valueChanges.subscribe((id) => {
      if (id) {
        this.router.navigate(['/purchase-order-return', id]);
      }
    });
  }

  createPurchaseOrder() {
    this.route.data.pipe().subscribe((purchaseOrderData: { purchaseorder: PurchaseOrder }) => {
      this.purchaseOrder = purchaseOrderData.purchaseorder;
      if (this.purchaseOrder) {
        this.isEdit = true;
        this.purchaseOrderForm = this.fb.group({
          orderNumber: [{ value: this.purchaseOrder.orderNumber, disabled: false }],
          filerSupplier: [{ value: '', disabled: true }],
          deliveryDate: [
            { value: this.purchaseOrder.deliveryDate, disabled: true },
            [Validators.required],
          ],
          poCreatedDate: [
            { value: this.purchaseOrder.poCreatedDate, disabled: true },
            [Validators.required],
          ],
          deliveryStatus: [this.purchaseOrder.deliveryStatus],
          supplierId: [
            { value: this.purchaseOrder.supplierId, disabled: true },
            [Validators.required],
          ],
          note: [{ value: '', disabled: false }],
          packagingTypeId: [{ value: this.purchaseOrder.packagingTypeId, disabled: true }],
          purchaseOrderItems: this.fb.array([]),
        });
        this.purchaseOrder.purchaseOrderItems.forEach((c) => {
          this.purchaseOrderItemsArray.push(
            this.createPurchaseOrderItemPatch(this.purchaseOrderItemsArray.length, c),
          );
        });
        this.supplierNameChangeValue();
        this.getSuppliers();
        this.getAllTotal();
      } else {
        this.createPurchaseOrderReturnOrder();
        this.purchaseResouce.pageSize = 10;
        this.purchaseResouce.status = PurchaseOrderStatusEnum.Not_Return;
        this.purchaseOrderService
          .getAllPurchaseOrder(this.purchaseResouce)
          .subscribe((resp: HttpResponse<PurchaseOrder[]>) => {
            if (resp && resp.headers) {
              this.purchaseorders = [...resp.body];
            }
          });
      }
    });
  }

  onAddAnotherchemical() {
    this.purchaseOrderItemsArray.push(
      this.createPurchaseOrderItem(this.purchaseOrderItemsArray.length),
    );
  }

  createPurchaseOrderItemPatch(index: number, purchaseOrderItem: PurchaseOrderItem) {
    const taxs = purchaseOrderItem.purchaseOrderItemTaxes.map((c) => c.taxId);
    const formGroup = this.fb.group({
      chemicalId: [{ value: purchaseOrderItem.chemicalId, disabled: true }, [Validators.required]],
      filterChemicalValue: [{ value: '', disabled: true }],
      unitPrice: [{ value: purchaseOrderItem.unitPrice, disabled: true }, [Validators.required]],
      quantity: [{ value: purchaseOrderItem.quantity, disabled: true }, [Validators.required]],
      reurnquntity: [
        { value: purchaseOrderItem.quantity, disabled: false },
        [Validators.required, Validators.max(purchaseOrderItem.quantity), Validators.min(1)],
      ],
      taxValue: [{ value: taxs, disabled: true }],
      unitId: [{ value: purchaseOrderItem.chemical.unitId, disabled: true }, [Validators.required]],
      discountPercentage: [{ value: purchaseOrderItem.discountPercentage, disabled: true }],
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
      unitPrice: [0, [Validators.required]],
      quantity: [0, [Validators.required]],
      taxValue: [null],
      unitId: [{ value: null, disabled: true }],
      discountPercentage: [0],
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
        switchMap((c) => {
          this.chemicalResource.name = c;
          return this.chemicalService.getChemicals(this.chemicalResource);
        }),
      )
      .subscribe(
        (resp: HttpResponse<Chemical[]>) => {
          if (resp && resp.headers) {
            this.filterChemicalsMap[index.toString()] = [...resp.body];
          }
        },
        (err) => {},
      );
  }

  getAllTotal() {
    let purchaseOrderItemsArray = this.purchaseOrderForm.get(
      'purchaseOrderItems',
    ) as UntypedFormArray;
    let purchaseOrderItems = purchaseOrderItemsArray.getRawValue();
    this.totalBeforeDiscount = 0;
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach((po) => {
        if (po.unitPrice && po.reurnquntity) {
          const totalBeforeDiscount =
            this.totalBeforeDiscount +
            parseFloat(this.quantitiesUnitPricePipe.transform(po.reurnquntity, po.unitPrice));
          this.totalBeforeDiscount = parseFloat(totalBeforeDiscount.toFixed(2));
          const gradTotal =
            this.grandTotal +
            parseFloat(
              this.quantitiesUnitPricePipe.transform(
                po.reurnquntity,
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
                po.reurnquntity,
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
                po.reurnquntity,
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
    this.purchaseOrderItemsArray.controls.forEach((c: UntypedFormGroup, index: number) => {
      const chemicalId = c.get('chemicalId').value;
      this.purchaseOrder.purchaseOrderItems.map((pi) => {
        if (pi.chemical.id === chemicalId) {
          this.filterChemicalsMap[index.toString()] = this.cloneService.deepClone([pi.chemical]);
        }
      });
    });
    this.getAllTotal();
  }

  getChemicals(index: number) {
    if (this.chemicals.length === 0) {
      this.chemicalResource.name = '';
      this.chemicalService.getChemicals(this.chemicalResource).subscribe(
        (resp: HttpResponse<Chemical[]>) => {
          this.chemicals = [...resp.body];
          this.filterChemicalsMap[index.toString()] = [...resp.body];
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

  supplierNameForSearchChangeValue() {
    this.sub$.sink = this.purchaseOrderReturnForm
      .get('filerSupplier')
      .valueChanges.pipe(
        tap((c) => (this.isSupplierLoading = true)),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.supplierResource.supplierName = c;
          this.supplierResource.id = null;
          return this.supplierService.getSuppliers(this.supplierResource);
        }),
      )
      .subscribe(
        (resp: HttpResponse<Supplier[]>) => {
          this.isSupplierLoading = false;
          if (resp && resp.headers) {
            this.suppliersForSearch = [...resp.body];
          }
        },
        (err) => {
          this.isSupplierLoading = false;
        },
      );
  }

  supplierNameChangeValue() {
    this.sub$.sink = this.purchaseOrderForm
      .get('filerSupplier')
      .valueChanges.pipe(
        tap((c) => (this.isSupplierLoading = true)),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.supplierResource.supplierName = c;
          this.supplierResource.id = null;
          return this.supplierService.getSuppliers(this.supplierResource);
        }),
      )
      .subscribe(
        (resp: HttpResponse<Supplier[]>) => {
          this.isSupplierLoading = false;
          if (resp && resp.headers) {
            this.suppliers = [...resp.body];
          }
        },
        (err) => {
          this.isSupplierLoading = false;
        },
      );
  }

  getSuppliers() {
    if (this.purchaseOrder) {
      this.supplierResource.id = this.purchaseOrder.supplierId;
    } else {
      this.supplierResource.supplierName = '';
      this.supplierResource.id = null;
    }
    this.supplierService.getSuppliers(this.supplierResource).subscribe((resp) => {
      if (resp && resp.headers) {
        this.suppliers = [...resp.body];
        this.suppliersForSearch = [...resp.body];
      }
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
        this.purchaseOrderService.updatePurchaseOrderReturn(purchaseOrder).subscribe(
          (c: PurchaseOrder) => {
            this.isLoading = false;
            this.toastrService.success(
              this.translationService.getValue('PURCHASE_ORDER_RETURN_ADDED'),
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
      deliveryStatus: DeliveryStatusEnum.UnDelivery,
      isPurchaseOrderRequest: false,
      poCreatedDate: this.purchaseOrderForm.get('poCreatedDate').value,
      purchaseOrderStatus: PurchaseOrderStatusEnum.Return,
      supplierId: this.purchaseOrderForm.get('supplierId').value,
      totalAmount: this.grandTotal,
      totalDiscount: this.totalDiscount,
      totalTax: this.totalTax,
      note: this.purchaseOrderForm.get('note').value,
      purchaseOrderItems: [],
      isStockAtSupplierWarehouse: false,
      supplierInvoiceNumber: '',
      packagingTypeId: this.purchaseOrderForm.get('packagingTypeId').value,
    };

    const purchaseOrderItemsArray = this.purchaseOrderForm.get(
      'purchaseOrderItems',
    ) as UntypedFormArray;
    const purchaseOrderItems = purchaseOrderItemsArray.getRawValue();
    if (purchaseOrderItems && purchaseOrderItems.length > 0) {
      purchaseOrderItems.forEach((po) => {
        purchaseOrder.purchaseOrderItems.push({
          discount: parseFloat(
            this.quantitiesUnitPriceTaxPipe.transform(
              po.reurnquntity,
              po.unitPrice,
              po.discountPercentage,
            ),
          ),
          discountPercentage: po.discountPercentage,
          chemicalId: po.chemicalId,
          quantity: po.reurnquntity,
          taxValue: parseFloat(
            this.quantitiesUnitPriceTaxPipe.transform(
              po.reurnquntity,
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
  cancel() {
    this.location.back();
  }
}
