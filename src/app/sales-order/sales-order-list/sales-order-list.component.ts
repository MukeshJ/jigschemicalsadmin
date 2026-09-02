import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Customer } from '@core/domain-classes/customer';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { ClonerService } from '@core/services/clone.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CustomerService } from 'src/app/customer/customer.service';
import { AddSalesOrderPaymentComponent } from '../add-sales-order-payment/add-sales-order-payment.component';
import { SalesOrderService } from '../sales-order.service';
import { ViewSalesOrderPaymentComponent } from '../view-sales-order-payment/view-sales-order-payment.component';
import { SalesOrderDataSource } from './sales-order-datasource';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { NgClass, AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
import { MatOption } from '@angular/material/select';
import { SalesOrderItemsComponent } from './sales-order-items/sales-order-items.component';
import { SalesOrderInvoiceComponent } from '../../shared/sales-order-invoice/sales-order-invoice.component';
import { PaymentStatusPipe } from '../../shared/pipes/purchase-order-paymentStatus.pipe';
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLink,
    MatProgressSpinner,
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
    FormsModule,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    SalesOrderItemsComponent,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    SalesOrderInvoiceComponent,
    AsyncPipe,
    PaymentStatusPipe,
    CustomCurrencyPipe,
    UTCToLocalTime,
    TranslatePipe,
  ],
})
export class SalesOrderListComponent extends BaseComponent implements OnInit {
  dataSource: SalesOrderDataSource;
  salesOrders: SalesOrder[] = [];
  displayedColumns: string[] = [
    'action',
    'soCreatedDate',
    'orderNumber',
    'deliveryDate',
    'customerName',
    'totalDiscount',
    'totalTax',
    'totalAmount',
    'totalPaidAmount',
    'paymentStatus',
    'status',
  ];
  filterColumns: string[] = [
    'action-search',
    'soCreatedDate-search',
    'orderNumber-search',
    'deliverDate-search',
    'customer-search',
    'totalAmount-search',
    'totalDiscount-search',
    'totalTax-search',
    'totalPaidAmount-search',
    'paymentStatus-search',
    'status-search',
  ];
  footerToDisplayed: string[] = ['footer'];
  isLoadingResults = true;
  salesOrderResource: SalesOrderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _customerFilter: string;
  _chemicalFilter: string;
  _orderNumberFilter: string;
  customerNameControl: UntypedFormControl = new UntypedFormControl();
  chemicalNameControl: UntypedFormControl = new UntypedFormControl();
  customerList$: Observable<Customer[]>;
  expandedElement: SalesOrder | null;
  public filterObservable$: Subject<string> = new Subject<string>();
  salesOrderForInvoice: SalesOrder;

  public get CustomerFilter(): string {
    return this._customerFilter;
  }

  public set CustomerFilter(v: string) {
    this._customerFilter = v;
    const customerFilter = `customerName:${v}`;
    this.filterObservable$.next(customerFilter);
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
    private salesOrderService: SalesOrderService,
    private customerService: CustomerService,
    private cd: ChangeDetectorRef,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private router: Router,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private clonerService: ClonerService,
  ) {
    super();
    this.salesOrderResource = new SalesOrderResourceParameter();
    this.salesOrderResource.pageSize = 50;
    this.salesOrderResource.orderBy = 'soCreatedDate asc';
  }

  ngOnInit(): void {
    this.customerNameControlOnChange();
    this.dataSource = new SalesOrderDataSource(this.salesOrderService);
    this.dataSource.loadData(this.salesOrderResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.salesOrderResource.skip = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'customerName') {
          this.salesOrderResource.customerName = strArray[1];
        } else if (strArray[0] === 'orderNumber') {
          this.salesOrderResource.orderNumber = strArray[1];
        }
        this.dataSource.loadData(this.salesOrderResource);
      });
  }

  onDetailSalesOrder(salesOrder: SalesOrder) {
    this.router.navigate(['/sales-order', salesOrder.id]);
  }

  customerNameControlOnChange() {
    this.customerList$ = this.customerNameControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((c) => {
        return this.customerService.getCustomersForDropDown('customerName', c);
      }),
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.salesOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.salesOrderResource.pageSize = this.paginator.pageSize;
          this.salesOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.salesOrderResource);
        }),
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.salesOrderResource.pageSize = c.pageSize;
        this.salesOrderResource.skip = c.skip;
        this.salesOrderResource.totalCount = c.totalCount;
      }
    });
  }

  toggleRow(element: SalesOrder) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.cd.detectChanges();
  }

  approveSalesOrder(salesOrder: SalesOrder) {
    this.commonDialogService
      .deleteConformationDialog('Are you Sure you want to Approve?')
      .subscribe((isYes) => {
        if (isYes) {
          this.salesOrderService.approveSalesOrder(salesOrder.id).subscribe(() => {
            this.toastrService.success('Sales Order Updated Successfully.');
            this.dataSource.loadData(this.salesOrderResource);
          });
        }
      });
  }

  deleteSalesOrder(salesOrder: SalesOrder) {
    this.commonDialogService
      .deleteConformationDialog(this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE'))
      .subscribe((isYes) => {
        if (isYes) {
          this.salesOrderService.deleteSalesOrder(salesOrder.id).subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('SALES_ORDER_DELETED_SUCCESSFULLY'),
            );
            this.dataSource.loadData(this.salesOrderResource);
          });
        }
      });
  }

  addPayment(salesOrder: SalesOrder): void {
    const dialogRef = this.dialog.open(AddSalesOrderPaymentComponent, {
      width: '100vh',
      data: Object.assign({}, salesOrder),
    });
    dialogRef.afterClosed().subscribe((isAdded: boolean) => {
      if (isAdded) {
        this.dataSource.loadData(this.salesOrderResource);
      }
    });
  }

  viewPayment(salesOrder: SalesOrder) {
    const dialogRef = this.dialog.open(ViewSalesOrderPaymentComponent, {
      data: Object.assign({}, salesOrder),
    });
    dialogRef.afterClosed().subscribe((isAdded: boolean) => {
      if (isAdded) {
        this.dataSource.loadData(this.salesOrderResource);
      }
    });
  }

  onSaleOrderReturn(saleOrder: SalesOrder) {
    this.router.navigate(['sales-order-return', saleOrder.id]);
  }

  generateInvoice(so: SalesOrder) {
    let soForInvoice = this.clonerService.deepClone<SalesOrder>(so);
    const getCustomerRequest = this.customerService.getCustomer(so.customerId);
    const getSalesOrderItems = this.salesOrderService.getSalesOrderItems(so.id);
    forkJoin({ getCustomerRequest, getSalesOrderItems }).subscribe((response) => {
      soForInvoice.customer = response.getCustomerRequest;
      soForInvoice.salesOrderItems = response.getSalesOrderItems;
      this.salesOrderForInvoice = soForInvoice;
    });
  }
}
