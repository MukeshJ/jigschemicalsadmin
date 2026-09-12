import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '@core/domain-classes/chemical';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierChemical } from '@core/domain-classes/supplier-chemical';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalLocalStore } from 'src/app/chemical/chemical-store';
import { SupplierChemicalService } from 'src/app/supplier-chemical/supplier-chemical.service';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatOption } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-supplier-chemical',
  templateUrl: './add-supplier-chemical.component.html',
  styleUrls: ['./add-supplier-chemical.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
    TranslatePipe,
],
  providers: [ChemicalLocalStore],
})
export class AddSupplierChemicalComponent extends BaseComponent implements OnInit {
  supplierChemicalForm: UntypedFormGroup;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  chemicals$: Observable<Chemical[]>;
  currentChemical: Chemical;

  private readonly chemicalStore = inject(ChemicalLocalStore);

  constructor(
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private supplierChemicalService: SupplierChemicalService,
    @Inject(MAT_DIALOG_DATA) public data: Supplier,
    public dialogRef: MatDialogRef<AddSupplierChemicalComponent>,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createSupplierChemicalForm();
    this.chemicalNameChangeEvent();
  }

  chemicalNameChangeEvent() {
    this.chemicals$ = this.supplierChemicalForm.get('chemicalName').valueChanges.pipe(
      debounceTime(1000),
      tap(() => (this.isLoading = true)),
      switchMap((value) =>
        this.chemicalStore.searchChemicals(value).pipe(
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

  createSupplierChemicalForm() {
    this.supplierChemicalForm = this.fb.group({
      supplierId: [this.data.id, [Validators.required]],
      chemicalName: ['', [Validators.required]],
    });
  }

  selectChemical(chemical: Chemical) {
    this.currentChemical = { ...chemical };
  }

  saveSupplierChemicals() {
    if (this.supplierChemicalForm.valid) {
      if (this.currentChemical.name != this.supplierChemicalForm.get('chemicalName').value) {
        this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_RIGHT_CHEMICAL'));
        return;
      }
      const chemicalSupplier: SupplierChemical = {
        chemicalId: this.currentChemical.id,
        supplierId: this.supplierChemicalForm.get('supplierId').value,
      };
      this.isLoading = true;
      this.sub$.sink = this.supplierChemicalService
        .addSupplierByChemical(chemicalSupplier)
        .subscribe(
          (c) => {
            this.isLoading = false;
            if (!c) {
              this.toastrService.error(
                `${this.translationService.getValue('CHEMICAL_ALREADY_ADDED_FOR')} ${this.data.supplierName}`,
              );
            } else {
              this.toastrService.success(
                `${this.translationService.getValue('CHEMICAL_ADDED_FOR')} ${this.data.supplierName}`,
              );
              this.dialogRef.close({ flag: true });
            }
          },
          () => {
            this.isLoading = false;
          },
        );
    } else {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_RIGHT_SUPPLIER'));
    }
  }

  closeDialog() {
    this.dialogRef.close({ flag: false });
  }
}
