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
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierChemicals } from '@core/domain-classes/supplier-chemicals';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import { ChemicalService } from '../chemical/chemical.service';
import { SupplierService } from '../supplier/supplier.service';
import { SupplierChemicalService } from './supplier-chemical.service';
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
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-chemical',
  templateUrl: './supplier-chemical.component.html',
  styleUrls: ['./supplier-chemical.component.scss'],
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
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class SupplierChemicalComponent extends BaseComponent implements OnInit {
  supplierChemicalForm: UntypedFormGroup;
  selectedSupplier: Supplier;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  displayedColumns = ['action', 'name', 'casNumber'];
  supplierChemicals: Chemical[] = [];
  totalChemicals = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  SupplierResource: SupplierResourceParameter;
  chemicals$: Observable<Chemical[]>;
  suppliers$: Observable<Supplier[]>;

  constructor(
    private fb: UntypedFormBuilder,
    private supplierService: SupplierService,
    private supplierChemicalService: SupplierChemicalService,
    private chemicalService: ChemicalService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
  ) {
    super();
    this.SupplierResource = new SupplierResourceParameter();
    this.SupplierResource.pageSize = 10;
  }

  ngOnInit(): void {
    this.createSupplierChemicalForm();
    this.suppliers$ = this.supplierChemicalForm.get('supplierNameInput').valueChanges.pipe(
      debounceTime(1000),
      tap(() => (this.isLoading = true)),
      switchMap((value) => {
        this.SupplierResource.searchQuery = value;
        return this.supplierChemicalService.searchSupplier(this.SupplierResource).pipe(
          tap(() => {
            this.isLoading = false;
          }),
        );
      }),
      finalize(() => {
        this.isLoading = false;
      }),
    );

    this.chemicals$ = this.supplierChemicalForm.get('chemicalNameInput').valueChanges.pipe(
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

  get supplierChemicalsArray(): UntypedFormArray {
    return <UntypedFormArray>this.supplierChemicalForm.get('supplierChemicals');
  }

  createSupplierChemicalForm() {
    this.supplierChemicalForm = this.fb.group({
      supplierNameInput: [''],
      chemicalNameInput: [''],
      supplierChemicals: this.fb.array([]),
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
    this.supplierChemicalsArray.push(this.addChemicalToSupplier(chemical));
    this.supplierChemicalForm.get('chemicalNameInput').setValue(null);
  };

  selectSupplier = (supplier: Supplier) => {
    this.selectedSupplier = supplier;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.skip = 0;
    this.pageSize = 10;
    this.getChemicalsList();
  };

  removeChemical(index: number) {
    this.supplierChemicalsArray.removeAt(index);
  }

  getChemicalsList() {
    const supplierId = this.selectedSupplier.id;
    this.isLoading = true;
    this.sub$.sink = this.supplierService
      .getChemicalsBySupplierId(supplierId, this.skip, this.pageSize, '', '')
      .subscribe(
        (c) => {
          this.supplierChemicals = c.chemicals;
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

  saveSupplierChemicals() {
    var chemicalIdList = (this.supplierChemicalsArray.value as Chemical[]).map((c) => c.id);
    if (chemicalIdList.length == 0) {
      this.toastrService.error(
        this.translationService.getValue('PLEASE_SELECT_ATLEASE_ONE_CHEMICAL'),
      );
      return;
    }
    this.isLoading = true;
    var supplierChemicals: SupplierChemicals = {
      supplierId: this.selectedSupplier.id,
      chemicalIdList,
    };

    this.sub$.sink = this.supplierChemicalService.addChemicalSupplier(supplierChemicals).subscribe(
      () => {
        this.toastrService.success(
          this.translationService.getValue('SUPPLIER_CHEMICAL_SAVED_SUCCESSFULLY'),
        );
        while (this.supplierChemicalsArray.length !== 0) {
          this.supplierChemicalsArray.removeAt(0);
        }
        this.isLoading = false;
        this.getChemicalsList();
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  removeChemicalFromSupplier(chemical: Chemical) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ?`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.supplierChemicalService
            .deleteSupplierChemcial(chemical.id, this.selectedSupplier.id)
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
