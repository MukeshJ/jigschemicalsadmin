import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierChemical } from '@core/domain-classes/supplier-chemical';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, finalize, map, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { SupplierChemicalService } from 'src/app/supplier-chemical/supplier-chemical.service';

@Component({
  standalone: false,
  selector: 'app-add-supplier-chemical',
  templateUrl: './add-supplier-chemical.component.html',
  styleUrls: ['./add-supplier-chemical.component.scss']
})
export class AddSupplierChemicalComponent extends BaseComponent implements OnInit {
  supplierChemicalForm: FormGroup;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  chemicals$: Observable<Chemical[]>;
  chemicalResource: ChemicalResourceParameter;
  currentChemical: Chemical;

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private supplierChemicalService: SupplierChemicalService,
    @Inject(MAT_DIALOG_DATA) public data: Supplier,
    public dialogRef: MatDialogRef<AddSupplierChemicalComponent>,
    private chemicalService: ChemicalService,
    private translationService: TranslationService,
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
    this.chemicals$ = this.supplierChemicalForm
      .get('chemicalName')
      .valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value => {
          this.chemicalResource.name = value
          return this.chemicalService.getChemicals(this.chemicalResource)
            .pipe(tap(() => { this.isLoading = false }),
              map(c => c.body))
        }
        ),
        finalize(() => { this.isLoading = false })
      );
  }

  createSupplierChemicalForm() {
    this.supplierChemicalForm = this.fb.group({
      supplierId: [this.data.id, [Validators.required]],
      chemicalName: ['', [Validators.required]]
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
        supplierId: this.supplierChemicalForm.get('supplierId').value
      };
      this.isLoading = true;
      this.sub$.sink = this.supplierChemicalService.addSupplierByChemical(chemicalSupplier)
        .subscribe(c => {
          this.isLoading = false;
          if (!c) {
            this.toastrService.error(`${this.translationService.getValue('CHEMICAL_ALREADY_ADDED_FOR')} ${this.data.supplierName}`);
          } else {
            this.toastrService.success(`${this.translationService.getValue('CHEMICAL_ADDED_FOR')} ${this.data.supplierName}`);
            this.dialogRef.close({ flag: true });
          }
        }, () => {
          this.isLoading = false;
        });
    } else {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_RIGHT_SUPPLIER'));
    }
  }

  closeDialog() {
    this.dialogRef.close({ flag: false });
  }

}
