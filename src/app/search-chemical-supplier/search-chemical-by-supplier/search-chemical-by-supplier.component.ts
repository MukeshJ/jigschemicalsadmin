import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Chemical } from '@core/domain-classes/chemical';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SupplierChemicalService } from 'src/app/supplier-chemical/supplier-chemical.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { AsyncPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatPrefix, MatOption } from '@angular/material/select';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
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
  selector: 'app-search-chemical-by-supplier',
  templateUrl: './search-chemical-by-supplier.component.html',
  styleUrls: ['./search-chemical-by-supplier.component.scss'],
  imports: [
    MatCard,
    FormsModule,
    ReactiveFormsModule,
    MatPrefix,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
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
export class SearchChemicalBySupplierComponent extends BaseComponent implements OnInit {
  supplierChemicalForm: UntypedFormGroup;
  selectedSupplier: Supplier;
  isLoading = false;
  skip = 0;
  pageSize = 15;
  displayedColumns = ['name', 'casNumber'];
  footerToDisplayed: string[] = ['footer'];
  supplierChemicals: Chemical[] = [];
  totalChemicals = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  SupplierResource: SupplierResourceParameter;
  suppliers$: Observable<Supplier[]>;
  _nameFilter = '';
  _casNumberFilter = '';
  public filterObservable$: Subject<string> = new Subject<string>();

  public get NameFilter(): string {
    return this._nameFilter;
  }
  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `name:${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get CasNumberFilter(): string {
    return this._casNumberFilter;
  }
  public set CasNumberFilter(v: string) {
    this._casNumberFilter = v;
    const casNumberFilter = `casNumber:${v}`;
    this.filterObservable$.next(casNumberFilter);
  }

  constructor(
    private fb: UntypedFormBuilder,
    private supplierService: SupplierService,
    private supplierChemicalService: SupplierChemicalService,
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

    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.skip = 0;
        if (this.paginator) {
          this.paginator.firstPage();
        }
        this.getChemicalsList();
      });
  }

  createSupplierChemicalForm() {
    this.supplierChemicalForm = this.fb.group({
      supplierNameInput: [''],
    });
  }

  selectSupplier = (supplier: Supplier) => {
    this.selectedSupplier = supplier;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.skip = 0;
    this.pageSize = 15;
    this.getChemicalsList();
  };

  getChemicalsList() {
    const supplierId = this.selectedSupplier.id;
    this.isLoading = true;
    this.sub$.sink = this.supplierService
      .getChemicalsBySupplierId(
        supplierId,
        this.skip,
        this.pageSize,
        this.NameFilter,
        this.CasNumberFilter,
      )
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
}
