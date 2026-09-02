import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Supplier } from '@core/domain-classes/supplier';
import { ClonerService } from '@core/services/clone.service';
import { dateCompare } from '@core/services/date-range';
import { TranslationService } from '@core/services/translation.service';
import { CustomCurrencyPipe } from '@shared/pipes/custome-currency.pipe';
import { PaymentStatusPipe } from '@shared/pipes/purchase-order-paymentStatus.pipe';
import { UTCToLocalTime } from '@shared/pipes/utc-to-localtime.pipe';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, merge, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { AddPurchaseOrderPaymentsComponent } from 'src/app/purchase-order/add-purchase-order-payments/add-purchase-order-payments.component';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { ViewPurchaseOrderPaymentComponent } from 'src/app/purchase-order/view-purchase-order-payment/view-purchase-order-payment.component';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { PurchaseOrderReportDataSource } from './purchase-order-report.datasource';
import * as XLSX from 'xlsx';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { NgClass, AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDatepickerInput, MatDatepicker } from '@angular/material/datepicker';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatFooterCellDef,
  MatFooterCell,
  MatNoDataRow,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { PurchaseOrderItemComponent } from './purchase-order-item/purchase-order-item.component';
import { PurchaseOrderInvoiceComponent } from '../../shared/purchase-order-invoice/purchase-order-invoice.component';
import { PaymentStatusPipe as PaymentStatusPipe_1 } from '../../shared/pipes/purchase-order-paymentStatus.pipe';
import { CustomCurrencyPipe as CustomCurrencyPipe_1 } from '../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime as UTCToLocalTime_1 } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-purchase-order-report',
  templateUrl: './purchase-order-report.component.html',
  styleUrls: ['./purchase-order-report.component.scss'],
  providers: [UTCToLocalTime, CustomCurrencyPipe, PaymentStatusPipe],
  imports: [
    HasClaimDirective,
    RouterLink,
    MatProgressSpinner,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepicker,
    MatSelect,
    MatDivider,
    MatOption,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatSortHeader,
    NgClass,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    PurchaseOrderItemComponent,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    PurchaseOrderInvoiceComponent,
    AsyncPipe,
    PaymentStatusPipe_1,
    CustomCurrencyPipe_1,
    UTCToLocalTime_1,
    TranslatePipe,
  ],
})
export class PurchaseOrderReportComponent extends BaseComponent {
  dataSource: PurchaseOrderReportDataSource;
  purchaseOrders: PurchaseOrder[] = [];
  displayedColumns: string[] = [
    'action',
    'poCreatedDate',
    'orderNumber',
    'deliveryDate',
    'supplierName',
    'totalDiscount',
    'totalTax',
    'totalAmount',
    'totalPaidAmount',
    'paymentStatus',
    'status',
  ];
  filterColumns: string[] = [
    'action-search',
    'poCreatedDate-search',
    'orderNumber-search',
    'deliverDate-search',
    'supplier-search',
    'totalAmount-search',
    'totalDiscount-search',
    'totalTax-search',
    'totalPaidAmount-search',
    'paymentStatus-search',
    'status-search',
  ];
  footerToDisplayed: string[] = ['footer'];
  isLoadingResults = true;
  purchaseOrderResource: PurchaseOrderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _supplierFilter: string;
  _orderNumberFilter: string;
  supplierNameControl: UntypedFormControl = new UntypedFormControl();
  supplierList$: Observable<Supplier[]>;
  expandedElement: PurchaseOrder | null;
  public filterObservable$: Subject<string> = new Subject<string>();
  searchForm: UntypedFormGroup;
  chemicals: Chemical[] = [];
  chemicalResource: ChemicalResourceParameter;

  purchaseOrderForInvoice: PurchaseOrder;
  currentDate: Date = new Date();
  public get SupplierFilter(): string {
    return this._supplierFilter;
  }

  public set SupplierFilter(v: string) {
    this._supplierFilter = v;
    const supplierFilter = `supplierName:${v}`;
    this.filterObservable$.next(supplierFilter);
  }

  public get OrderNumberFilter(): string {
    return this._orderNumberFilter;
  }

  public set OrderNumberFilter(v: string) {
    this._orderNumberFilter = v;
    const orderNumberFilter = `orderNumber:${v}`;
    this.filterObservable$.next(orderNumberFilter);
  }

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService,
    private cd: ChangeDetectorRef,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private router: Router,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private clonerService: ClonerService,
    private fb: UntypedFormBuilder,
    private chemicalService: ChemicalService,
    private utcToLocalTime: UTCToLocalTime,
    private customCurrencyPipe: CustomCurrencyPipe,
    private paymentStatusPipe: PaymentStatusPipe,
  ) {
    super();
    this.chemicalResource = new ChemicalResourceParameter();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = false;
  }

  ngOnInit(): void {
    this.supplierNameControlOnChange();
    this.createSearchFormGroup();
    this.getChemicalByNameValue();
    this.getChemicals();
    this.dataSource = new PurchaseOrderReportDataSource(this.purchaseOrderService);
    this.dataSource.loadData(this.purchaseOrderResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.purchaseOrderResource.skip = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'supplierName') {
          this.purchaseOrderResource.supplierName = strArray[1];
        } else if (strArray[0] === 'orderNumber') {
          this.purchaseOrderResource.orderNumber = strArray[1];
        }
        this.dataSource.loadData(this.purchaseOrderResource);
      });
  }

  createSearchFormGroup() {
    this.searchForm = this.fb.group(
      {
        fromDate: [''],
        toDate: [''],
        filterChemicalValue: [''],
        chemicalId: [''],
      },
      {
        validators: dateCompare(),
      },
    );
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.purchaseOrderResource.fromDate = this.searchForm.get('fromDate').value;
      this.purchaseOrderResource.toDate = this.searchForm.get('toDate').value;
      this.purchaseOrderResource.chemicalId = this.searchForm.get('chemicalId').value;
      this.dataSource.loadData(this.purchaseOrderResource);
    }
  }

  addPayment(purchaseOrder: PurchaseOrder): void {
    const dialogRef = this.dialog.open(AddPurchaseOrderPaymentsComponent, {
      width: '100vh',
      data: Object.assign({}, purchaseOrder),
    });
    dialogRef.afterClosed().subscribe((isAdded: boolean) => {
      if (isAdded) {
        this.dataSource.loadData(this.purchaseOrderResource);
      }
    });
  }

  onClear() {
    this.searchForm.reset();
    this.purchaseOrderResource.fromDate = this.searchForm.get('fromDate').value;
    this.purchaseOrderResource.toDate = this.searchForm.get('toDate').value;
    this.purchaseOrderResource.chemicalId = this.searchForm.get('chemicalId').value;
    this.dataSource.loadData(this.purchaseOrderResource);
  }

  getChemicalByNameValue() {
    this.sub$.sink = this.searchForm
      .get('filterChemicalValue')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.chemicalResource.chemicalId = c;
          return this.chemicalService.getChemicals(this.chemicalResource);
        }),
      )
      .subscribe(
        (resp: HttpResponse<Chemical[]>) => {
          if (resp && resp.headers) {
            this.chemicals = [...resp.body];
          }
        },
        (err) => {},
      );
  }

  getChemicals() {
    this.chemicalResource.name = '';
    return this.chemicalService.getChemicals(this.chemicalResource).subscribe(
      (resp: HttpResponse<Chemical[]>) => {
        if (resp && resp.headers) {
          this.chemicals = [...resp.body];
        }
      },
      (err) => {},
    );
  }

  onDetailPurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.router.navigate(['/purchase-order', purchaseOrder.id]);
  }

  supplierNameControlOnChange() {
    this.supplierList$ = this.supplierNameControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((c) => {
        return this.supplierService.getSuppliersForDropDown(c);
      }),
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.purchaseOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.purchaseOrderResource.pageSize = this.paginator.pageSize;
          this.purchaseOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.purchaseOrderResource);
        }),
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.purchaseOrderResource.pageSize = c.pageSize;
        this.purchaseOrderResource.skip = c.skip;
        this.purchaseOrderResource.totalCount = c.totalCount;
      }
    });
  }

  toggleRow(element: PurchaseOrder) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.cd.detectChanges();
  }

  poChangeEvent(purchaseOrder: PurchaseOrder) {
    this.toggleRow(purchaseOrder);
  }

  deletePurchaseOrder(purchaseOrder: PurchaseOrder) {
    this.commonDialogService
      .deleteConformationDialog(this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .subscribe((isYes) => {
        if (isYes) {
          this.purchaseOrderService.deletePurchaseOrder(purchaseOrder.id).subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('PURCHASE_ORDER_DELETED_SUCCESSFULLY'),
            );
            this.dataSource.loadData(this.purchaseOrderResource);
          });
        }
      });
  }

  viewPayment(purchaseOrder: PurchaseOrder) {
    const dialogRef = this.dialog.open(ViewPurchaseOrderPaymentComponent, {
      data: Object.assign({}, purchaseOrder),
    });
    dialogRef.afterClosed().subscribe((isAdded: boolean) => {
      if (isAdded) {
        this.dataSource.loadData(this.purchaseOrderResource);
      }
    });
  }

  OnPurchaseOrderReturn(purchaseOrder: PurchaseOrder) {
    this.router.navigate(['/purchase-order-return', purchaseOrder.id]);
  }

  generateInvoice(po: PurchaseOrder) {
    let poForInvoice = this.clonerService.deepClone<PurchaseOrder>(po);
    const getSupplierRequest = this.supplierService.getSupplier(po.supplierId);
    const getPurchaseOrderItems = this.purchaseOrderService.getPurchaseOrderItems(po.id);
    forkJoin({ getSupplierRequest, getPurchaseOrderItems }).subscribe((response) => {
      poForInvoice.supplier = response.getSupplierRequest;
      poForInvoice.purchaseOrderItems = response.getPurchaseOrderItems;
      this.purchaseOrderForInvoice = poForInvoice;
    });
  }

  onDownloadReport() {
    this.purchaseOrderService
      .getAllPurchaseOrderReport(this.purchaseOrderResource)
      .subscribe((c: HttpResponse<PurchaseOrder[]>) => {
        this.purchaseOrders = [...c.body];
        let heading = [
          [
            this.translationService.getValue('CREATED_DATE'),
            this.translationService.getValue('ORDER_NUMBER'),
            this.translationService.getValue('DELIVERY_DATE'),
            this.translationService.getValue('SUPPLIER_NAME'),
            this.translationService.getValue('TOTAL_DISCOUNT'),
            this.translationService.getValue('TOTAL_TAX'),
            this.translationService.getValue('TOTAL_AMOUNT'),
            this.translationService.getValue('TOTAL_PAID_AMOUNT'),
            this.translationService.getValue('PAYMENT_STATUS'),
            this.translationService.getValue('IS_RETURN'),
          ],
        ];

        let purchaseOrderReport = [];
        this.purchaseOrders.forEach((purchaseOrder: PurchaseOrder) => {
          purchaseOrderReport.push({
            CREATED_DATE: this.utcToLocalTime.transform(purchaseOrder.poCreatedDate, 'shortDate'),
            ORDER_NUMBER: purchaseOrder.orderNumber,
            DELIVERY_DATE: this.utcToLocalTime.transform(purchaseOrder.deliveryDate, 'shortDate'),
            SUPPLIER_NAME: purchaseOrder.supplierName,
            TOTAL_DISCOUNT: this.customCurrencyPipe.transform(purchaseOrder.totalDiscount),
            TOTAL_TAX: this.customCurrencyPipe.transform(purchaseOrder.totalTax),
            TOTAL_AMOUNT: this.customCurrencyPipe.transform(purchaseOrder.totalAmount),
            TOTAL_PAID_AMOUNT: this.customCurrencyPipe.transform(purchaseOrder.totalPaidAmount),
            PAYMENT_STATUS: this.paymentStatusPipe.transform(purchaseOrder.paymentStatus),
            IS_RETURN: purchaseOrder.status == 1 ? 'True' : 'False',
          });
        });

        let workBook = XLSX.utils.book_new();
        XLSX.utils.sheet_add_aoa(workBook, heading);
        let workSheet = XLSX.utils.sheet_add_json(workBook, purchaseOrderReport, {
          origin: 'A2',
          skipHeader: true,
        });
        XLSX.utils.book_append_sheet(
          workBook,
          workSheet,
          this.translationService.getValue('PURCHASE_ORDER_REPORT'),
        );
        XLSX.writeFile(
          workBook,
          this.translationService.getValue('PURCHASE_ORDER_REPORT') + '.xlsx',
        );
      });
  }
}
