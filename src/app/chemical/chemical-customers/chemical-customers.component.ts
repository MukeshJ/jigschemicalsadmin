import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Chemical } from '@core/domain-classes/chemical';
import { Customer } from '@core/domain-classes/customer';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CustomerChemicalService } from 'src/app/customer-chemical/customer-chemical.service';
import { CustomerService } from 'src/app/customer/customer.service';
import { AddChemicalCustomerComponent } from '../add-chemical-customer/add-chemical-customer.component';
import { HasClaimDirective } from '../../shared/has-claim.directive';
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
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chemical-customers',
  templateUrl: './chemical-customers.component.html',
  styleUrls: ['./chemical-customers.component.scss'],
  imports: [
    HasClaimDirective,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FormsModule,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    TranslatePipe,
  ],
})
export class ChemicalCustomersComponent extends BaseComponent implements OnInit {
  customers: Customer[] = [];
  isLoading: boolean = false;
  skip: number = 0;
  pageSize: number = 10;
  totalCustomers = 0;
  _nameFilter = '';
  _mobileFilter = '';
  _emailFilter = '';
  displayedColumns = ['name', 'email', 'mobile', 'action'];
  columnsToDisplay = ['footer'];
  public filterObservable$: Subject<string> = new Subject<string>();
  @ViewChild('paginator') paginator: MatPaginator;

  public get NameFilter(): string {
    return this._nameFilter;
  }
  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `name:${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get EmailFilter(): string {
    return this._emailFilter;
  }
  public set EmailFilter(v: string) {
    this._emailFilter = v;
    const emailFilter = `email:${v}`;
    this.filterObservable$.next(emailFilter);
  }

  public get MobileFilter(): string {
    return this._mobileFilter;
  }
  public set MobileFilter(v: string) {
    this._mobileFilter = v;
    const mobileFilter = `mobile:${v}`;
    this.filterObservable$.next(mobileFilter);
  }
  constructor(
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<ChemicalCustomersComponent>,
    private commonDialogService: CommonDialogService,
    private customerChemicalService: CustomerChemicalService,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Chemical,
    private translationService: TranslationService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        if (this.paginator) this.paginator.firstPage();
        this.getCustomersList();
      });
    if (this.data) {
      this.isLoading = true;
      this.getCustomersList();
    }
  }

  getCustomersList() {
    let customerResourceParameter = new CustomerResourceParameter();
    customerResourceParameter.chemicalId = this.data.id;
    customerResourceParameter.skip = this.skip;
    customerResourceParameter.pageSize = this.pageSize;
    customerResourceParameter.customerName = this.NameFilter;
    customerResourceParameter.email = this.EmailFilter;
    customerResourceParameter.mobileNo = this.MobileFilter;
    this.isLoading = true;
    this.sub$.sink = this.customerService
      .getCustomersByChemicalId(customerResourceParameter)
      .subscribe(
        (c) => {
          this.customers = c.customers;
          this.totalCustomers = c.totalCount;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
  }

  public pageChange(event: PageEvent): void {
    this.skip = event.pageIndex * event.pageSize;
    this.getCustomersList();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  removeCustomerFromChemial(customer: Customer) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${customer.customerName} ?`,
      )
      .subscribe((isTrue) => {
        if (isTrue) {
          this.sub$.sink = this.customerChemicalService
            .deleteCustomerChemcial(this.data.id, customer.id)
            .subscribe((data) => {
              this.toasterService.success(
                this.translationService.getValue('CUSTOMER_DELETED_SUCCESSFULLY'),
              );
              this.getCustomersList();
            });
        }
      });
  }
  addChemicalCustomer() {
    const dialogRef = this.dialog.open(AddChemicalCustomerComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, this.data),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result['flag']) {
        this.getCustomersList();
      }
    });
  }
}
