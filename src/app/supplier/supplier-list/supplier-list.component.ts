import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Country } from '@core/domain-classes/country';
import { Supplier } from '@core/domain-classes/supplier';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { AddSupplierChemicalComponent } from '../add-supplier-chemical/add-supplier-chemical.component';
import { ChemicalListComponent } from '../chemical-list/chemical-list.component';
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
import { TranslatePipe } from '@ngx-translate/core';
import { SupplierLocalStore } from '../supplier-store';

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
    AsyncPipe,
    TranslatePipe,
  ],
  providers: [SupplierLocalStore],
})
export class SupplierListComponent extends BaseComponent implements OnInit {
  // Component-scoped state management (mirrors ChemicalListComponent).
  readonly supplierStore = inject(SupplierLocalStore);

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

  // Country autocomplete + row expansion are purely local UI concerns.
  countryList: Country[] = [];
  filteredCountryList: Observable<Country[]>;
  countryControl = new UntypedFormControl();
  expandedElement: Supplier | null;

  constructor(
    private commonDialogService: CommonDialogService,
    private router: Router,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCountries();
    this.filteredCountryList = this.countryControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCountryForAutoComplete(value)),
    );
  }
  
  deleteSupplier(supplier: Supplier): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${supplier.supplierName}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.supplierStore.deleteSupplier(supplier);
        }
      });
  }

  // ----- country autocomplete (local UI state) -----

  private _filterCountryForAutoComplete(value: string): Country[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.countryList.filter((country) =>
      country.countryName.toLowerCase().includes(filterValue),
    );
  }

  getCountries(): void {
    this.sub$.sink = this.commonService
      .getCountry()
      .subscribe((c) => (this.countryList = c));
  }

  // ----- navigation / dialogs / row expansion -----

  editSupplier(supplierId: string): void {
    this.router.navigate(['/supplier/manage', supplierId]);
  }

  viewChemical(supplier: Supplier): void {
    this.dialog.open(ChemicalListComponent, {
      height: 'auto',
      data: Object.assign({}, supplier),
    });
  }

  addChemcialSupplier(supplier: Supplier): void {
    const dialogRef = this.dialog.open(AddSupplierChemicalComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, supplier),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result['flag']) {
        this.supplierStore.refreshSuppliers();
      }
    });
  }

  toggleRow(supplier: Supplier): void {
    this.expandedElement = this.expandedElement === supplier ? null : supplier;
    this.cd.detectChanges();
  }
}
