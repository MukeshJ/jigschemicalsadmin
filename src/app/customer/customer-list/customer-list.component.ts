import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { CustomerService } from '../customer.service';
import { merge, Observable, Subject } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { Customer } from '@core/domain-classes/customer';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { CustomerDataSource } from './customer-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { TranslationService } from '@core/services/translation.service';
import { MatDialog } from '@angular/material/dialog';
import { ChemicalListComponent } from '../chemical-list/chemical-list.component';
import { AddCustomerChemicalComponent } from '../add-customer-chemical/add-customer-chemical.component';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { AsyncPipe } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { CustomerSOListComponent } from './customer-so-list/customer-so-list.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
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
    FormsModule,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    CustomerSOListComponent,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CustomerListComponent extends BaseComponent implements OnInit {
  dataSource: CustomerDataSource;
  customers: Customer[] = [];
  displayedColumns: string[] = [
    'action',
    'customerName',
    'contactPerson',
    'email',
    'mobileNo',
    'website',
    'chemicalsCount',
  ];
  columnsToDisplay: string[] = ['footer'];
  isLoadingResults = true;
  customerResource: CustomerResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  _emailFilter: string;
  _mobileOrPhoneFilter: string;
  _websiteFilter: string;
  _contactPersonFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();
  expandedElement: Customer | null;

  public get NameFilter(): string {
    return this._nameFilter;
  }

  public set ContactFilter(v: string) {
    this._contactPersonFilter = v;
    const customerNameFilter = `customerName##${v}`;
    this.filterObservable$.next(customerNameFilter);
  }

  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `supplierName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get WebsiteFilter(): string {
    return this._websiteFilter;
  }

  public set WebsiteFilter(v: string) {
    this._websiteFilter = v;
    const websiteFilter = `website##${v}`;
    this.filterObservable$.next(websiteFilter);
  }

  public get EmailFilter(): string {
    return this._emailFilter;
  }
  public set EmailFilter(v: string) {
    this._emailFilter = v;
    const emailFilter = `email##${v}`;
    this.filterObservable$.next(emailFilter);
  }

  public get MobileOrPhoneFilter(): string {
    return this._mobileOrPhoneFilter;
  }

  public set MobileOrPhoneFilter(v: string) {
    this._mobileOrPhoneFilter = v;
    const mobileOrFilter = `mobileNo##${v}`;
    this.filterObservable$.next(mobileOrFilter);
  }

  constructor(
    private customerService: CustomerService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) {
    super();
    this.customerResource = new CustomerResourceParameter();
    this.customerResource.pageSize = 50;
    this.customerResource.orderBy = 'customerName asc';
  }

  ngOnInit(): void {
    this.dataSource = new CustomerDataSource(this.customerService);
    this.dataSource.loadData(this.customerResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.customerResource.skip = 0;
        const strArray: Array<string> = c.split('##');
        if (strArray[0] === 'supplierName') {
          this.customerResource.customerName = escape(strArray[1]);
        } else if (strArray[0] === 'email') {
          this.customerResource.email = strArray[1];
        } else if (strArray[0] === 'mobileNo') {
          this.customerResource.mobileNo = strArray[1];
        } else if (strArray[0] === 'website') {
          this.customerResource.website = encodeURI(strArray[1].trim());
        }
        this.dataSource.loadData(this.customerResource);
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.customerResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.customerResource.pageSize = this.paginator.pageSize;
          this.customerResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.customerResource);
        }),
      )
      .subscribe();
  }

  deleteCustomer(customer: Customer) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${customer.customerName}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.customerService.deleteCustomer(customer.id).subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('CUSTOMER_DELETED_SUCCESSFULLY'),
            );
            this.paginator.pageIndex = 0;
            this.dataSource.loadData(this.customerResource);
          });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.customerResource.pageSize = c.pageSize;
        this.customerResource.skip = c.skip;
        this.customerResource.totalCount = c.totalCount;
      }
    });
  }

  editCustomer(customerId: string) {
    this.router.navigate(['/customer', customerId]);
  }

  viewChemicals(customer: Customer): void {
    this.dialog.open(ChemicalListComponent, {
      data: Object.assign({}, customer),
    });
  }

  addChemcialCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(AddCustomerChemicalComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, customer),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result['flag']) {
        this.dataSource.loadData(this.customerResource);
      }
    });
  }

  toggleRow(customer: Customer) {
    this.expandedElement = this.expandedElement === customer ? null : customer;
    this.cd.detectChanges();
  }
}
