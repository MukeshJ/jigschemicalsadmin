import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Customer } from '@core/domain-classes/customer';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { DeliveryMethod } from '@core/domain-classes/delivery-method';
import { DeliveryStatusEnum } from '@core/domain-classes/delivery-status-enum';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderAttachment } from '@core/domain-classes/sales-order-attachment';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { SalesOrderItemTax } from '@core/domain-classes/sales-order-item-tax';
import { SalesOrderStatusEnum } from '@core/domain-classes/sales-order-status';
import { SalesPurchaseOrderItem } from '@core/domain-classes/sales-purchase-order-item';
import { Tax } from '@core/domain-classes/tax';
import { Unit } from '@core/domain-classes/unit';
import { DeliveryMethodService } from '@core/services/delivery-method.service';
import { PaymentTermService } from '@core/services/payment-term.service';
import { TaxService } from '@core/services/tax.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { QuantitiesUnitPriceTaxPipe } from '@shared/pipes/quantities-unitprice-tax.pipe';
import { QuantitiesUnitPricePipe } from '@shared/pipes/quantities-unitprice.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { CustomerService } from 'src/app/customer/customer.service';
import { SalesOrderService } from '../sales-order.service';

@Component({
  standalone: false,
  selector: 'app-sales-order-add-edit',
  templateUrl: './sales-order-add-edit.component.html',
  styleUrls: ['./sales-order-add-edit.component.scss'],
  viewProviders: [QuantitiesUnitPricePipe, QuantitiesUnitPriceTaxPipe]
})
export class SalesOrderAddEditComponent extends BaseComponent {
  _validFileExtensions = environment.allowFileExtension;
  taxes$: Observable<Tax[]>;
  salesOrderForm: UntypedFormGroup;
  chemicals: Chemical[] = [];
  customers: Customer[] = [];
  paymentTerms: any[] = [];
  deliveryMethods: DeliveryMethod[] = [];
  customerResource: CustomerResourceParameter;
  chemicalResource: ChemicalResourceParameter;
  isLoading: boolean = false;
  isCustomerLoading: boolean = false;
  filterChemicalsMap: { [key: string]: Chemical[] } = {};
  unitsMap: { [key: string]: Unit[] } = {};
  taxsMap: { [key: string]: Tax[] } = {};
  totalBeforeDiscount: number = 0;
  totalAfterDiscount: number = 0;
  totalDiscount: number = 0;
  grandTotal: number = 0;
  totalTax: number = 0;
  timeoutclear: any;
  salesOrder: SalesOrder;
  isEdit: boolean = false;
  salesOrderAttachment: SalesOrderAttachment[] = [];
  


  get salesOrderItemsArray(): UntypedFormArray {
    return <UntypedFormArray>this.salesOrderForm.get('salesOrderItems');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private toastrService: ToastrService,
    private salesOrderService: SalesOrderService,
    private router: Router,
    private taxService: TaxService,
    private chemicalService: ChemicalService,
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private quantitiesUnitPricePipe: QuantitiesUnitPricePipe,
    private quantitiesUnitPriceTaxPipe: QuantitiesUnitPriceTaxPipe,
    private paymentTermService: PaymentTermService,
    private deliveryMethodService: DeliveryMethodService,
  ) {
    super();
    this.customerResource = new CustomerResourceParameter();
    this.chemicalResource = new ChemicalResourceParameter();
  }

  ngOnInit(): void {
    this.getSalesOrderById();
    this.createSalesOrder();
    this.getPaymentTerms();
    this.getDeliveryMethod();
    this.customerNameChangeValue();
    this.getNewSalesOrderNumber();
    this.getTaxes();
  }

  onFilterValue(filterValue: any) {
    console.log(filterValue);
  }

  getTaxes() {
    this.taxes$ = this.taxService.entities$;
  }

  createSalesOrder() {
    this.route.data
      .pipe(
      )
      .subscribe((salesOrderData: { 'salesorder': SalesOrder }) => {
        this.salesOrder = salesOrderData.salesorder;
        if (this.salesOrder) {
          this.isEdit = true;
          this.salesOrderForm = this.fb.group({
            orderNumber: [this.salesOrder.orderNumber, [Validators.required]],
            filerCustomer: [''],
            soCreatedDate: [this.salesOrder.soCreatedDate, [Validators.required]],
            deliveryStatus: [this.salesOrder.deliveryStatus],
            customerId: [this.salesOrder.customerId, [Validators.required]],
            paymentTermId: [this.salesOrder.paymentTermId],
            deliveryMethodId: [this.salesOrder.deliveryMethodId],
            note: [this.salesOrder.note],
            termAndCondition: [this.salesOrder.termAndCondition],
            salesOrderItems: this.fb.array([]),
            deliveryDate: [this.salesOrder.deliveryDate]
          });
          this.salesOrder.salesOrderItems.forEach(c => {
            this.salesOrderItemsArray.push(this.createSalesOrderItemPatch(this.salesOrderItemsArray.length, c));
          });
          this.getCustomers();
          this.getAllTotal();
        } else {
          this.isEdit = false;
          this.getCustomers();
          this.salesOrderForm = this.fb.group({
            orderNumber: ['', [Validators.required]],
            filerCustomer: [''],
            deliveryDate: [new Date(), [Validators.required]],
            soCreatedDate: [new Date(), [Validators.required]],
            deliveryStatus: [1],
            customerId: ['', [Validators.required]],
            paymentTermId: [''],
            deliveryMethodId: [''],
            note: [''],
            termAndCondition: [''],
            salesOrderItems: this.fb.array([])

          });
          this.salesOrderItemsArray.push(this.createSalesOrderItem(this.salesOrderItemsArray.length));
        }
      });
  }

  onAddAnotherProduct() {
    this.salesOrderItemsArray.push(this.createSalesOrderItem(this.salesOrderItemsArray.length));
  }

  createSalesOrderItemPatch(index: number, salesOrderItem: SalesOrderItem) {
    const taxs = salesOrderItem.salesOrderItemTaxes.map(c => c.taxId);
    const formGroup = this.fb.group({
      chemicalId: [salesOrderItem.chemicalId, [Validators.required]],
      filterChemicalValue: [''],
      unitPrice: [salesOrderItem.unitPrice, [Validators.required]],
      quantity: [salesOrderItem.quantity, [Validators.required]],
      taxValue: [taxs],
      unitId: [{ value: salesOrderItem.chemical.unitId, disabled: true }, [Validators.required]],
      discountPercentage: [salesOrderItem.discountPercentage]
    });
    this.unitsMap[index] = [... this.route.snapshot.data['units']];
    this.taxsMap[index] = [... this.route.snapshot.data['taxs']];
    this.filterChemicalsMap[index.toString()] = [salesOrderItem.chemical];
    return formGroup;
  }

  createSalesOrderItem(index: number) {
    const formGroup = this.fb.group({
      chemicalId: ['', [Validators.required]],
      filterChemicalValue: [''],
      unitPrice: [0, [Validators.required,Validators.min(1)]],
      quantity: [1, [Validators.required,Validators.min(1)]],
      taxValue: [null],
      unitId: [{ value: null, disabled: true }],
      discountPercentage: [0,[Validators.min(0)]]
    });
    this.unitsMap[index] = [... this.route.snapshot.data['units']];
    this.taxsMap[index] = [... this.route.snapshot.data['taxs']];
    this.filterChemicalsMap[index.toString()] = [...this.route.snapshot.data['chemicals']];
    this.getChemicalsByNameValue(formGroup, index);
    return formGroup;
  }

  getChemicalsByNameValue(formGroup: UntypedFormGroup, index: number) {
    if (this.salesOrder) {
      this.getChemicals(index);
    }
    this.sub$.sink = formGroup.get('filterChemicalValue').valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.chemicalResource.name = c;
          return this.chemicalService.getChemicals(this.chemicalResource);
        })
      ).subscribe((resp: HttpResponse<Chemical[]>) => {
        if (resp && resp.headers) {
          this.filterChemicalsMap[index.toString()] = [...resp.body];
        }
      }, (err) => {

      });

  }

  getAllTotal() {
    let salesOrderItems = this.salesOrderForm.get('salesOrderItems').value;
    this.totalBeforeDiscount = 0;
    this.grandTotal = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    if (salesOrderItems && salesOrderItems.length > 0) {
      salesOrderItems.forEach(so => {
        if (so.unitPrice && so.quantity) {
          const totalBeforeDiscount = this.totalBeforeDiscount + parseFloat(this.quantitiesUnitPricePipe.transform(so.quantity, so.unitPrice));
          this.totalBeforeDiscount = parseFloat(totalBeforeDiscount.toFixed(2));
          const gradTotal = this.grandTotal + parseFloat(this.quantitiesUnitPricePipe.transform(so.quantity, so.unitPrice, so.discountPercentage, so.taxValue, this.taxsMap[0]));
          this.grandTotal = parseFloat(gradTotal.toFixed(2));
          const totalTax = this.totalTax + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.quantity, so.unitPrice, so.discountPercentage, so.taxValue, this.taxsMap[0]));
          this.totalTax = parseFloat(totalTax.toFixed(2));
          const totalDiscount = this.totalDiscount + parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.quantity, so.unitPrice, so.discountPercentage));
          this.totalDiscount = parseFloat(totalDiscount.toFixed(2));
        }
      })
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

  onRemoveSalesOrderItem(index: number) {
    this.salesOrderItemsArray.removeAt(index);
    this.salesOrderItemsArray.controls.forEach((c: UntypedFormGroup, index: number)=>{
      const chemicalId= c.get('chemicalId').value;
      if(chemicalId){
    this.salesOrder.salesOrderItems.map(pi => {
          if(pi.chemical.id=== chemicalId){
          if(this.chemicals.find(c=> c.id=== chemicalId)){
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

  getPaymentTerms() {
    this.paymentTermService.getAll().subscribe(c => this.paymentTerms = c);
  }

  getDeliveryMethod() {
    this.deliveryMethodService.getAll().subscribe(methods => {
      this.deliveryMethods = methods;
    })
  }

  getChemicals(index: number, chemicalId?: string) {
    if (this.chemicals.length === 0 || chemicalId) {
      this.chemicalResource.name = '';
      this.chemicalResource.chemicalId= chemicalId? chemicalId:'';
      this.chemicalService.getChemicals(this.chemicalResource)
        .subscribe((resp: HttpResponse<Chemical[]>) => {
          this.chemicals = [...resp.body];
          this.filterChemicalsMap[index.toString()] = [...resp.body];
        }, (err) => {
        });
    } else {
      this.filterChemicalsMap[index.toString()] = [...this.chemicals];
    }

  }

  onProductSelectionChange(value: any, index: number) {
    this.salesOrderItemsArray.controls[index].patchValue({
      filterChemicalValue: '',
      unitPrice:'',
    });
    const chemical = this.filterChemicalsMap[index].find((c: Chemical) => c.id === value.value);
    if (chemical) {
      this.salesOrderItemsArray.controls[index].patchValue({
        unitId: chemical.unitId,
      });
    }
  }

  getNewSalesOrderNumber() {
    this.salesOrderService.getNewSalesOrderNumber().subscribe(salesOrder => {
      if (!this.salesOrder) {
        this.salesOrderForm.patchValue({
          orderNumber: salesOrder.orderNumber
        });
      }
    });
  }


  customerNameChangeValue() {
    this.sub$.sink = this.salesOrderForm.get('filerCustomer').valueChanges
      .pipe(
        tap(c => this.isCustomerLoading = true),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(c => {
          this.customerResource.customerName = c;
          this.customerResource.id = null;
          return this.customerService.getCustomers(this.customerResource);
        })
      ).subscribe((resp: HttpResponse<Customer[]>) => {
        this.isCustomerLoading = false;
        if (resp && resp.headers) {
          this.customers = [...resp.body];
        }
      }, (err) => {
        this.isCustomerLoading = false;
      });
  }

  getCustomers() {

    if (this.salesOrder) {
      this.customerResource.id = this.salesOrder.customerId;
    } else {
      this.customerResource.customerName = '';
      this.customerResource.id = null;
    }
    this.customerService.getCustomers(this.customerResource)
      .subscribe(resp => {
        if (resp && resp.headers) {
          this.customers = [...resp.body];
        }
      });
  }

  onSalesOrderSubmit() {
    if (!this.salesOrderForm.valid) {
      this.salesOrderForm.markAllAsTouched();
    } else {
      if (this.salesOrder && this.salesOrder.salesOrderStatus === SalesOrderStatusEnum.Return) {
        this.toastrService.error(this.translationService.getValue('RETURN_SALES_ORDER_CANT_BE_EDIT'));
        return;
      }
      const salesOrder = this.buildSalesOrder();
      if (salesOrder.id) {
        this.salesOrderService.updateSalesOrder(salesOrder)
          .subscribe((c: SalesOrder) => {
            this.toastrService.success(this.translationService.getValue("SALES_ORDER_SAVED_SUCCESSFULLY"));
            this.router.navigate(['/sales-order/list']);
          })
      } else {
        this.salesOrderService.createSalesOrder(salesOrder)
          .subscribe((c: SalesOrder) => {
            this.toastrService.success(this.translationService.getValue("SALES_ORDER_SAVED_SUCCESSFULLY"));
            this.router.navigate(['/sales-order/list']);
          });
      }

    }
  }

  buildSalesOrder() {
    const salesOrder: SalesOrder = {
      id: this.salesOrder ? this.salesOrder.id : '',
      orderNumber: this.salesOrderForm.get('orderNumber').value,
      deliveryStatus: DeliveryStatusEnum.UnDelivery,
      soCreatedDate: this.salesOrderForm.get('soCreatedDate').value,
      salesOrderStatus: SalesOrderStatusEnum.Not_Return,
      customerId: this.salesOrderForm.get('customerId').value,
      paymentTermId: this.salesOrderForm.get('paymentTermId').value,
      deliveryMethodId: this.salesOrderForm.get('deliveryMethodId').value,
      totalAmount: this.grandTotal,
      totalDiscount: this.totalDiscount,
      totalTax: this.totalTax,
      note: this.salesOrderForm.get('note').value,
      termAndCondition: this.salesOrderForm.get('termAndCondition').value,
      deliveryDate: this.salesOrderForm.get('deliveryDate').value,
      salesOrderItems: [],
      salesOrderAttachments: [],
    };
    this.salesOrderAttachment.forEach(attachement => {
      salesOrder.salesOrderAttachments.push({
        documentData: attachement.documentData,
        name: attachement.name
      });
    })

    const salesOrderItems = this.salesOrderForm.get('salesOrderItems').value;
    if (salesOrderItems && salesOrderItems.length > 0) {
      salesOrderItems.forEach(so => {
        salesOrder.salesOrderItems.push(
          {
            discount: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.quantity, so.unitPrice, so.discountPercentage)),
            discountPercentage: so.discountPercentage,
            chemicalId: so.chemicalId,
            quantity: so.quantity,
            taxValue: parseFloat(this.quantitiesUnitPriceTaxPipe.transform(so.quantity, so.unitPrice, so.discountPercentage, so.taxValue, this.taxsMap[0])),
            unitPrice: parseFloat(so.unitPrice),
            salesOrderItemTaxes: [
              ...so.taxValue ? so.taxValue.map(element => {
                const salesOrderItemTaxes: SalesOrderItemTax = {
                  taxId: element
                };
                return salesOrderItemTaxes;
              }) : []
            ]
          }
        )
      });
    }
    return salesOrder;
  }
  onSalesOrderList() {
    this.router.navigate(['/sales-order/list']);
  }

  getSalesOrderById() {
    this.salesOrder = this.route.snapshot.data['salesorder'];
    if (this.salesOrder) {

    }
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
          this.salesOrderAttachment.push({
            name: file.name,
            documentData: reader.result.toString()
          })
        }
      }
    }
  }

  removeAttachemet(fileName) {
    this.salesOrderAttachment = this.salesOrderAttachment.filter(c => c.name != fileName);
  }

  Validate(fileName: string) {
    var sFileName = fileName;
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < this._validFileExtensions.length; j++) {
        var sCurExtension = this._validFileExtensions[j];
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }
      if (!blnValid) {
        this.toastrService.error(sFileName + this.translationService.getValue('IS_INVALID_ALLOWED_EXTENSIONS_ARE') + this._validFileExtensions.join(", "));
        return false;
      }
    }
    return true;
  }

  downloadAttachment(attachement: SalesOrderAttachment) {
    this.sub$.sink = this.salesOrderService.downloadAttachment(attachement.id)
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
}
