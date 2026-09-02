import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Chemical } from '@core/domain-classes/chemical';
import { Customer } from '@core/domain-classes/customer';
import { CustomerChemicals } from '@core/domain-classes/customer-chemicals';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import { ChemicalService } from '../chemical/chemical.service';
import { CustomerService } from '../customer/customer.service';
import { CustomerChemicalService } from './customer-chemical.service';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/select';
import { MatChipSet, MatChip } from '@angular/material/chips';
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
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-chemical',
  templateUrl: './customer-chemical.component.html',
  styleUrls: ['./customer-chemical.component.scss'],
  imports: [
    MatProgressSpinner,
    MatCard,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatChipSet,
    MatChip,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
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
export class CustomerChemicalComponent extends BaseComponent implements OnInit {
  customerChemicalForm: UntypedFormGroup;
  selectedCustomer: Customer;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  displayedColumns = ['action', 'name', 'casNumber'];
  columnsToDisplay: string[] = ['footer'];
  customerChemicals: Chemical[] = [];
  totalChemicals = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  customerResource: CustomerResourceParameter;
  chemicals$: Observable<Chemical[]>;
  customers$: Observable<Customer[]>;

  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private customerChemicalService: CustomerChemicalService,
    private chemicalService: ChemicalService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
  ) {
    super();
    this.customerResource = new CustomerResourceParameter();
    this.customerResource.pageSize = 10;
  }

  ngOnInit(): void {
    this.createSupplierChemicalForm();
    this.customers$ = this.customerChemicalForm.get('customerNameInput').valueChanges.pipe(
      debounceTime(1000),
      tap(() => (this.isLoading = true)),
      switchMap((value) => {
        this.customerResource.searchQuery = value;
        return this.customerChemicalService.searchCustomer(this.customerResource).pipe(
          tap(() => {
            this.isLoading = false;
          }),
        );
      }),
      finalize(() => {
        this.isLoading = false;
      }),
    );

    this.chemicals$ = this.customerChemicalForm.get('chemicalNameInput').valueChanges.pipe(
      debounceTime(1000),
      tap(() => (this.isLoading = true)),
      switchMap((value) =>
        this.chemicalService.getChemicalsForDropDown('all', value).pipe(
          tap(() => {
            this.isLoading = false;
          }),
        ),
      ),
      finalize(() => {
        this.isLoading = false;
      }),
    );
  }

  get customerChemicalsArray(): UntypedFormArray {
    return <UntypedFormArray>this.customerChemicalForm.get('customerChemicals');
  }

  createSupplierChemicalForm() {
    this.customerChemicalForm = this.fb.group({
      customerNameInput: [''],
      chemicalNameInput: [''],
      customerChemicals: this.fb.array([]),
    });
  }

  addChemicalToSupplier(chemical: Chemical): UntypedFormGroup {
    return this.fb.group({
      id: [chemical.id],
      name: [chemical.name],
      casNumber: [chemical.casNumber],
    });
  }

  selectChemical = (chemical: Chemical) => {
    this.customerChemicalsArray.push(this.addChemicalToSupplier(chemical));
    this.customerChemicalForm.get('chemicalNameInput').setValue(null);
  };

  selectCustomer = (customer: Customer) => {
    this.selectedCustomer = customer;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.skip = 0;
    this.pageSize = 10;
    this.getChemicalsList();
  };

  removeChemical(index: number) {
    this.customerChemicalsArray.removeAt(index);
  }

  getChemicalsList() {
    const customerId = this.selectedCustomer.id;
    this.isLoading = true;
    this.sub$.sink = this.customerChemicalService
      .getChemicalsByCustomerId(customerId, this.skip, this.pageSize, '', '')
      .subscribe(
        (c) => {
          this.customerChemicals = c.chemicals;
          this.totalChemicals = c.totalCount;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
  }

  public pageChange(event: PageEvent): void {
    this.skip = event.pageIndex * event.pageSize;
    this.getChemicalsList();
  }

  saveCustomerChemicals() {
    var chemicalIdList = (this.customerChemicalsArray.value as Chemical[]).map((c) => c.id);
    if (chemicalIdList.length == 0) {
      this.toastrService.error(
        this.translationService.getValue('PLEASE_SELECT_ATLEASE_ONE_PRODUCT'),
      );
      return;
    }
    this.isLoading = true;
    var customerChemicals: CustomerChemicals = {
      customerId: this.selectedCustomer.id,
      chemicalIdList,
    };

    this.sub$.sink = this.customerChemicalService.addChemicalCustomer(customerChemicals).subscribe(
      () => {
        this.toastrService.success(
          this.translationService.getValue('CUSTOMER_CHEMICAL_SAVED_SUCCESSFULLY'),
        );
        while (this.customerChemicalsArray.length !== 0) {
          this.customerChemicalsArray.removeAt(0);
        }
        this.isLoading = false;
        this.getChemicalsList();
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  removeChemicalFromcustomer(chemical: Chemical) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ?`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.customerChemicalService
            .deleteCustomerChemcial(chemical.id, this.selectedCustomer.id)
            .subscribe(() => {
              this.toastrService.success(
                this.translationService.getValue('CHEMICAL_REMOVED_SUCCESSFULLY'),
              );
              this.getChemicalsList();
            });
        }
      });
  }
}
