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
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
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
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import * as XLSX from 'xlsx';
import { ChemicalPurchaseReportDataSource } from './chemical-purchase-report.datasource';
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
import { CustomCurrencyPipe as CustomCurrencyPipe_1 } from '../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime as UTCToLocalTime_1 } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chemical-purchase-report',
  templateUrl: './chemical-purchase-report.component.html',
  styleUrls: ['./chemical-purchase-report.component.scss'],
  providers: [UTCToLocalTime, CustomCurrencyPipe, PaymentStatusPipe],
  imports: [
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
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    CustomCurrencyPipe_1,
    UTCToLocalTime_1,
    TranslatePipe,
  ],
})
export class ChemicalPurchaseReportComponent extends BaseComponent {
  dataSource: ChemicalPurchaseReportDataSource;
  purchaseOrderItems: PurchaseOrderItem[] = [];
  displayedColumns: string[] = [
    'chemicalName',
    'purchaseOrderNumber',
    'supplierName',
    'pOCreatedDate',
    'unitName',
    'unitPrice',
    'quantity',
    'totalDiscount',
    'taxes',
    'totalTax',
    'totalAmount',
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
  searchForm: UntypedFormGroup;
  currentDate: Date = new Date();
  chemicals: Chemical[] = [];
  chemcialResource: ChemicalResourceParameter;

  public filterObservable$: Subject<string> = new Subject<string>();

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
  ) {
    super();
    this.chemcialResource = new ChemicalResourceParameter();
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 50;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.isPurchaseOrderRequest = false;
  }

  ngOnInit(): void {
    this.supplierNameControlOnChange();
    this.createSearchFormGroup();
    this.getChemicals();
    this.getChemcialByNameValue();
    this.dataSource = new ChemicalPurchaseReportDataSource(this.purchaseOrderService);
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

  onClear() {
    this.searchForm.reset();
    this.purchaseOrderResource.fromDate = this.searchForm.get('fromDate').value;
    this.purchaseOrderResource.toDate = this.searchForm.get('toDate').value;
    this.purchaseOrderResource.chemicalId = this.searchForm.get('chemicalId').value;
    this.dataSource.loadData(this.purchaseOrderResource);
  }

  getChemcialByNameValue() {
    this.sub$.sink = this.searchForm
      .get('filterChemicalValue')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => {
          this.chemcialResource.name = c;
          return this.chemicalService.getChemicals(this.chemcialResource);
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
    this.chemcialResource.name = '';
    return this.chemicalService.getChemicals(this.chemcialResource).subscribe(
      (resp: HttpResponse<Chemical[]>) => {
        if (resp && resp.headers) {
          this.chemicals = [...resp.body];
        }
      },
      (err) => {},
    );
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

  onDownloadReport() {
    this.purchaseOrderService
      .getAllPurchaseOrderItemReport(this.purchaseOrderResource)
      .subscribe((c: HttpResponse<PurchaseOrderItem[]>) => {
        this.purchaseOrderItems = [...c.body];
        let heading = [
          [
            this.translationService.getValue('CHEMICAL_NAME'),
            this.translationService.getValue('ORDER_NUMBER'),
            this.translationService.getValue('SUPPLIER'),
            this.translationService.getValue('PURCHASE_DATE'),
            this.translationService.getValue('UNIT'),
            this.translationService.getValue('UNIT_PER_PRICE'),
            this.translationService.getValue('QUANTITY'),
            this.translationService.getValue('TOTAL_DISCOUNT'),
            this.translationService.getValue('TAX'),
            this.translationService.getValue('TOTAL_TAX'),
            this.translationService.getValue('TOTAL'),
          ],
        ];

        let purchaseOrderReport = [];
        this.purchaseOrderItems.forEach((purchaseOrderItem: PurchaseOrderItem) => {
          purchaseOrderReport.push({
            CHEMICAL_NAME: purchaseOrderItem.chemicalName,
            ORDER_NUMBER: purchaseOrderItem.purchaseOrderNumber,
            SUPPLIER: purchaseOrderItem.supplierName,
            PURCHASE_DATE: this.utcToLocalTime.transform(
              purchaseOrderItem.poCreatedDate,
              'shortDate',
            ),
            UNIT: purchaseOrderItem.unitName,
            UNIT_PER_PRICE: this.customCurrencyPipe.transform(purchaseOrderItem.unitPrice),
            QUANTITY: purchaseOrderItem.quantity,
            TOTAL_DISCOUNT: this.customCurrencyPipe.transform(purchaseOrderItem.discount),
            TAX: purchaseOrderItem.purchaseOrderItemTaxes.map(
              (c) => c.taxName + '(' + c.taxPercentage + ' %)',
            ),
            TOTAL_TAX: this.customCurrencyPipe.transform(purchaseOrderItem.taxValue),
            TOTAL: this.customCurrencyPipe.transform(
              purchaseOrderItem.unitPrice * purchaseOrderItem.quantity -
                purchaseOrderItem.discount +
                purchaseOrderItem.taxValue,
            ),
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
          this.translationService.getValue('CHEMCIAL_PURCHASE_REPORT'),
        );
        XLSX.writeFile(
          workBook,
          this.translationService.getValue('CHEMCIAL_PURCHASE_REPORT') + '.xlsx',
        );
      });
  }
}
