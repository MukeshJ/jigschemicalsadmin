import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Customer } from '@core/domain-classes/customer';
import { CustomerChemical } from '@core/domain-classes/customer-chemical';
import { CommonError } from '@core/error-handler/common-error';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, debounceTime, finalize, map, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { CustomerChemicalService } from 'src/app/customer-chemical/customer-chemical.service';

@Component({
  standalone: false,
  selector: 'app-add-customer-chemical',
  templateUrl: './add-customer-chemical.component.html',
  styleUrls: ['./add-customer-chemical.component.scss']
})
export class AddCustomerChemicalComponent extends BaseComponent implements OnInit {

  customerChemicalForm: FormGroup;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  chemicals$: Observable<Chemical[]>;
  chemicalResource: ChemicalResourceParameter;
  currentChemical: Chemical;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private customerChemicalService: CustomerChemicalService,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    public dialogRef: MatDialogRef<AddCustomerChemicalComponent>,
    private chemicalService: ChemicalService,
    private translationService:TranslationService
  ) {
    super();
    this.chemicalResource = new ChemicalResourceParameter();
    this.chemicalResource.pageSize = 10;
  }

  ngOnInit(): void {
    this.createSupplierChemicalForm();
    this.chemicalNameChangeEvent();
  }

  chemicalNameChangeEvent() {
    this.chemicals$ = this.customerChemicalForm
      .get('chemicalName')
      .valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value => {
          this.chemicalResource.name = value
          return this.chemicalService.getChemicals(this.chemicalResource)
            .pipe(tap(() => { this.isLoading = false }),
              map(c => c.body),
              catchError(c=> []))
        }
        ),
        finalize(() => { this.isLoading = false })
      );
  }

  createSupplierChemicalForm() {
    this.customerChemicalForm = this.fb.group({
      customerId: [this.data.id, [Validators.required]],
      chemicalName: ['', [Validators.required]]
    });
  }

  selectChemical(chemical: Chemical) {
    this.currentChemical = { ...chemical };
  }

  saveCustomerChemicals() {
    if (this.customerChemicalForm.valid) {
      if (this.currentChemical.name != this.customerChemicalForm.get('chemicalName').value) {
        this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_CHEMICAL'));
        return;
      }
      const chemicalCustomer: CustomerChemical = {
        chemicalId: this.currentChemical.id,
        customerId: this.customerChemicalForm.get('customerId').value
      };
      this.isLoading = true;
      this.sub$.sink = this.customerChemicalService.addCustomerByChemical(chemicalCustomer)
        .subscribe(c => {
          this.isLoading = false;
          if (!c) {
            this.toastrService.error(`${this.translationService.getValue('CHEMICAL_ALREADY_ADDED_FOR')} ${this.data.customerName}`);
          } else {
            this.toastrService.success(`${this.translationService.getValue('CHEMICAL_ADDED_FOR')} ${this.data.customerName}`);
            this.dialogRef.close({ flag: true });
          }
        }, () => {
          this.isLoading = false;
        });
    } else {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_CHEMICAL'));
    }
  }

  closeDialog() {
    this.dialogRef.close({ flag: false });
  }

}
