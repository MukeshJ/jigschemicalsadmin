import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '@core/domain-classes/chemical';
import { Customer } from '@core/domain-classes/customer';
import { CustomerChemical } from '@core/domain-classes/customer-chemical';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { CustomerChemicalService } from 'src/app/customer-chemical/customer-chemical.service';

@Component({
  standalone: false,
  selector: 'app-add-chemical-customer',
  templateUrl: './add-chemical-customer.component.html',
  styleUrls: ['./add-chemical-customer.component.scss']
})
export class AddChemicalCustomerComponent extends BaseComponent implements OnInit {

  customerChemicalForm: UntypedFormGroup;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  customers$: Observable<Customer[]>;
  customerResource: CustomerResourceParameter;
  currentCustomer: Customer;

  constructor(
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private customerChemicalService: CustomerChemicalService,
    @Inject(MAT_DIALOG_DATA) public data: Chemical,
    private translationService: TranslationService,
    public dialogRef: MatDialogRef<AddChemicalCustomerComponent>
  ) {
    super();
    this.customerResource = new CustomerResourceParameter();
    this.customerResource.pageSize = 10;
  }

  ngOnInit(): void {
    this.createCustomerChemicalForm();
    this.customerNameChangeEvent();
  }

  customerNameChangeEvent() {
    this.customers$ = this.customerChemicalForm
      .get('customerName')
      .valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value => {
          this.customerResource.searchQuery = value
          return this.customerChemicalService.searchCustomer(this.customerResource)
            .pipe(tap(() => { this.isLoading = false }))
        }
        ),
        finalize(() => { this.isLoading = false })
      );
  }

  createCustomerChemicalForm() {
    this.customerChemicalForm = this.fb.group({
      chemicalId: [this.data.id, [Validators.required]],
      customerName: ['', [Validators.required]]
    });
  }

  selectCustomer(customer: Customer) {
    this.currentCustomer = { ...customer };
  }


  saveCustomerChemicals() {
    if (this.customerChemicalForm.valid) {
      if (this.currentCustomer.customerName != this.customerChemicalForm.get('customerName').value) {
        this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_CUSTOMER'));
        return;
      }
      const chemicalSupplier: CustomerChemical = {
        chemicalId: this.customerChemicalForm.get('chemicalId').value,
        customerId: this.currentCustomer.id
      };
      this.isLoading = true;
      this.sub$.sink = this.customerChemicalService.addCustomerByChemical(chemicalSupplier)
        .subscribe(c => {
          this.isLoading = false;
          if (!c) {
            this.toastrService.error(`${this.translationService.getValue('CUSTOMER_ALREADY_ADDED_FOR')} ${this.data.name}`);
          } else {
            this.toastrService.success(`${this.translationService.getValue('CUSTOMER_ADDED_FOR')} ${this.data.name}`);
            this.dialogRef.close({ flag: true });
          }
        }, () => {
          this.isLoading = false;
        });
    } else {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_CUSTOMER'));
    }
  }

  closeDialog() {
    this.dialogRef.close({ flag: false });
  }


}
