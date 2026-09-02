import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '@core/domain-classes/chemical';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierChemical } from '@core/domain-classes/supplier-chemical';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SupplierChemicalService } from 'src/app/supplier-chemical/supplier-chemical.service';

@Component({
  standalone: false,
  selector: 'app-add-chemical-supplier',
  templateUrl: './add-chemical-supplier.component.html',
  styleUrls: ['./add-chemical-supplier.component.scss']
})
export class AddChemicalSupplierComponent extends BaseComponent implements OnInit {

  supplierChemicalForm: FormGroup;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  suppliers$: Observable<Supplier[]>;
  supplierResource: SupplierResourceParameter;
  currentSupplier: Supplier;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private supplierChemicalService: SupplierChemicalService,
    @Inject(MAT_DIALOG_DATA) public data: Chemical,
    public dialogRef: MatDialogRef<AddChemicalSupplierComponent>,
    private translationService: TranslationService
  ) {
    super();
    this.supplierResource = new SupplierResourceParameter();
    this.supplierResource.pageSize = 10;
  }

  ngOnInit(): void {
    this.createSupplierChemicalForm();
    this.supplierNameChangeEvent();

  }

  supplierNameChangeEvent() {
    this.suppliers$ = this.supplierChemicalForm
      .get('supplierName')
      .valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value => {
          this.supplierResource.searchQuery = value
          return this.supplierChemicalService.searchSupplier(this.supplierResource)
            .pipe(tap(() => { this.isLoading = false }))
        }
        ),
        finalize(() => { this.isLoading = false })
      );
  }

  createSupplierChemicalForm() {
    this.supplierChemicalForm = this.fb.group({
      chemicalId: [this.data.id, [Validators.required]],
      supplierName: ['', [Validators.required]]
    });
  }

  selectSupplier(supplier: Supplier) {
    this.currentSupplier = { ...supplier };
    this.patchSupplierId(supplier.id);
  }

  patchSupplierId(id: string) {
    this.supplierChemicalForm.patchValue({
      supplierId: id
    });
  }

  saveSupplierChemicals() {
    if (this.supplierChemicalForm.valid) {
      if (this.currentSupplier.supplierName != this.supplierChemicalForm.get('supplierName').value) {
        this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_SUPPLIER'));
        return;
      }
      const chemicalSupplier: SupplierChemical = {
        chemicalId: this.supplierChemicalForm.get('chemicalId').value,
        supplierId: this.currentSupplier.id
      };
      this.isLoading = true;
      this.sub$.sink = this.supplierChemicalService.addSupplierByChemical(chemicalSupplier)
        .subscribe(c => {
          this.isLoading = false;
          if (!c) {
            this.toastrService.error(`${this.translationService.getValue('SUPPLIER_ALREADY_ADDED_FOR')} ${this.data.name}`);
          } else {
            this.toastrService.success(`${this.translationService.getValue('SUPPLIER_ADDED_FOR')} ${this.data.name}`);
            this.dialogRef.close({ flag: true });
          }
        }, () => {
          this.isLoading = false;
        });
    } else {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_SUPPLIER'));
    }
  }

  closeDialog() {
    this.dialogRef.close({ flag: false });
  }


}
