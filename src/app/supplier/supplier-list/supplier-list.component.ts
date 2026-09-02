import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Country } from '@core/domain-classes/country';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { AddSupplierChemicalComponent } from '../add-supplier-chemical/add-supplier-chemical.component';
import { ChemicalListComponent } from '../chemical-list/chemical-list.component';
import { SupplierService } from '../supplier.service';
import { SupplierDataSource } from './supplier-datasource';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatFooterCellDef,
  MatFooterCell,
  MatNoDataRow,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/select';
import { SupplierPOListComponent } from './supplier-po-list/supplier-po-list.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLink,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatSortHeader,
    FormsModule,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    SupplierPOListComponent,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    MatProgressSpinner,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class SupplierListComponent extends BaseComponent implements OnInit {
  dataSource: SupplierDataSource;
  suppliers: Supplier[] = [];
  displayedColumns: string[] = [
    'action',
    'supplierName',
    'chemicalCount',
    'email',
    'mobileNo',
    'country',
    'website',
  ];
  columnsToDisplay: string[] = ['footer'];
  countryList: Country[] = [];
  filteredCountryList: Observable<Country[]>;
  countryControl = new UntypedFormControl();
  isLoadingResults = true;
  supplierResource: SupplierResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  _emailFilter: string;
  _mobileOrPhoneFilter: string;
  _websiteFilter: string;
  _countryFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();
  expandedElement: Supplier | null;

  public get NameFilter(): string {
    return this._nameFilter;
  }

  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `supplierName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get WebsiteFilter(): string {
    return this._websiteFilter;
  }

  public get CountryFilter(): string {
    return this._countryFilter;
  }

  public set CountryFilter(v: string) {
    this._countryFilter = v;
    const countryFilter = `country##${v}`;
    this.filterObservable$.next(countryFilter);
  }

  public set WebsiteFilter(v: string) {
    this._websiteFilter = v;
    const websiteFilter = `website##${v}`;
    this.filterObservable$.next(websiteFilter);
  }

  public get EmailFilter(): string {
    return this._emailFilter;
  }
  public set EmailFilter(v: string) {
    this._emailFilter = v;
    const emailFilter = `email##${v}`;
    this.filterObservable$.next(emailFilter);
  }

  public get MobileOrPhoneFilter(): string {
    return this._mobileOrPhoneFilter;
  }

  public set MobileOrPhoneFilter(v: string) {
    this._mobileOrPhoneFilter = v;
    const mobileOrFilter = `mobileNo##${v}`;
    this.filterObservable$.next(mobileOrFilter);
  }

  constructor(
    private supplierService: SupplierService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
  ) {
    super();
    this.supplierResource = new SupplierResourceParameter();
    this.supplierResource.pageSize = 10;
    this.supplierResource.orderBy = 'supplierName asc';
  }

  ngOnInit(): void {
    this.dataSource = new SupplierDataSource(this.supplierService);
    this.dataSource.loadData(this.supplierResource);
    this.getResourceParameter();
    this.getCountries();
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.supplierResource.skip = 0;
        const strArray: Array<string> = c.split('##');
        if (strArray[0] === 'supplierName') {
          this.supplierResource.supplierName = escape(strArray[1]);
        } else if (strArray[0] === 'email') {
          this.supplierResource.email = strArray[1];
        } else if (strArray[0] === 'mobileNo') {
          this.supplierResource.mobileNo = strArray[1];
        } else if (strArray[0] === 'website') {
          this.supplierResource.website = encodeURI(strArray[1].trim());
        } else if (strArray[0] === 'country') {
          this.supplierResource.country = strArray[1];
        }
        this.dataSource.loadData(this.supplierResource);
      });

    this.filteredCountryList = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCountryForAutoComplete(value)),
    );
  }

  private _filterCountryForAutoComplete(value: string) {
    const filterValue = value.toLowerCase();
    return this.countryList.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue),
    );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.supplierResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.supplierResource.pageSize = this.paginator.pageSize;
          this.supplierResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.supplierResource);
        }),
      )
      .subscribe();
  }

  getCountries() {
    this.sub$.sink = this.commonService.getCountry().subscribe((c) => (this.countryList = c));
  }

  deleteSupplier(supplier: Supplier) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${supplier.supplierName}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.supplierService.deleteSupplier(supplier.id).subscribe(() => {
            this.toastrService.success('Supplier is deleted.');
            this.paginator.pageIndex = 0;
            //this.supplierResource.name = this.input.nativeElement.value;
            this.dataSource.loadData(this.supplierResource);
          });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.supplierResource.pageSize = c.pageSize;
        this.supplierResource.skip = c.skip;
        this.supplierResource.totalCount = c.totalCount;
      }
    });
  }

  editSupplier(supplierId: string) {
    this.router.navigate(['/supplier/manage', supplierId]);
  }

  viewChemical(supplier: Supplier): void {
    this.dialog.open(ChemicalListComponent, {
      height: 'auto',
      data: Object.assign({}, supplier),
    });
  }

  addChemcialSupplier(supplier: Supplier) {
    const dialogRef = this.dialog.open(AddSupplierChemicalComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, supplier),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result['flag']) {
        this.dataSource.loadData(this.supplierResource);
      }
    });
  }

  toggleRow(supplier: Supplier) {
    this.expandedElement = this.expandedElement === supplier ? null : supplier;
    this.cd.detectChanges();
  }
}
