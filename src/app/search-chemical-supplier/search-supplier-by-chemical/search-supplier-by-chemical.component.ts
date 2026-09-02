import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from 'src/app/chemical/chemical.service';
import { SupplierService } from 'src/app/supplier/supplier.service';

@Component({
  selector: 'app-search-supplier-by-chemical',
  templateUrl: './search-supplier-by-chemical.component.html',
  styleUrls: ['./search-supplier-by-chemical.component.scss']
})
export class SearchSupplierByChemicalComponent extends BaseComponent implements OnInit {
  supplierChemicalForm: FormGroup;
  selectedChemical: Chemical;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  displayedColumns = ['supplierName', 'email', 'mobileNo'];
  footerToDisplayed: string[] = ['footer'];
  chemicalSuppliers: Supplier[] = [];
  totalSuppliers = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  chemicalResource: ChemicalResourceParameter;
  chemicals$: Observable<Chemical[]>;
  _nameFilter = '';
  public filterObservable$: Subject<string> = new Subject<string>();

  public get NameFilter(): string {
    return this._nameFilter;
  }
  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `name:${v}`;
    this.filterObservable$.next(nameFilter);
  }

  constructor(private fb: FormBuilder,
    private chemicalService: ChemicalService,
    private supplierService: SupplierService) {
    super();
    this.chemicalResource = new SupplierResourceParameter();
    this.chemicalResource.pageSize = 10;
  }

  ngOnInit(): void {
    this.createSupplierChemicalForm();
    this.chemicals$ = this.supplierChemicalForm
      .get('chemicalNameInput')
      .valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.chemicalService.getChemicalsForDropDown('all', value)
            .pipe(tap(() => { this.isLoading = false }))
        ),
        finalize(() => { this.isLoading = false })
      );

    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.skip = 0;
        if (this.paginator) {
          this.paginator.firstPage();
        }
        this.getSuppliersByChemical();
      });
  }

  createSupplierChemicalForm() {
    this.supplierChemicalForm = this.fb.group({
      chemicalNameInput: [''],
    });
  }

  selectChemical = (chemical: Chemical) => {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.selectedChemical = chemical;
    this.getSuppliersByChemical();
  };

  getSuppliersByChemical() {
    let supplierResourceParameter = new SupplierResourceParameter();
    supplierResourceParameter.chemicalId = this.selectedChemical.id;
    supplierResourceParameter.skip = this.skip;
    supplierResourceParameter.pageSize = this.pageSize;
    supplierResourceParameter.supplierName = this.NameFilter;
    this.isLoading = true;
    this.sub$.sink = this.supplierService.getSuppliersByChemicalId(supplierResourceParameter)
      .subscribe(supplierList => {
        this.isLoading = false;
        this.chemicalSuppliers = supplierList.suppliers;
        this.totalSuppliers = supplierList.totalCount;
      }, () => this.isLoading = false)
  }

  public pageChange(event: PageEvent): void {
    this.skip = event.pageIndex * event.pageSize;
    this.getSuppliersByChemical();
  }
}

