import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Chemical } from '@core/domain-classes/chemical';
import { Supplier } from '@core/domain-classes/supplier';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SupplierChemicalService } from 'src/app/supplier-chemical/supplier-chemical.service';
import { SupplierService } from 'src/app/supplier/supplier.service';
import { AddChemicalSupplierComponent } from '../add-chemical-supplier/add-chemical-supplier.component';
import { SelectionModel } from '@angular/cdk/collections';
import { SendEmailComponent } from '../send-email/send-email.component';
import { SendEmailSuppliers } from '@core/domain-classes/send-email-suppliers';
import { TranslationService } from '@core/services/translation.service';
import { Country } from '@core/domain-classes/country';
import { CommonService } from '@core/services/common.service';

@Component({
  standalone: false,
  selector: 'app-chemical-suppliers',
  templateUrl: './chemical-suppliers.component.html',
  styleUrls: ['./chemical-suppliers.component.scss']
})
export class ChemicalSuppliersComponent extends BaseComponent implements OnInit {
  suppliers: Supplier[] = [];
  countryList: Country[] = [];
  isLoading: boolean = false;
  skip: number = 0;
  pageSize: number = 10;
  totalSuppliers = 0;
  _nameFilter = '';
  _mobileFilter = '';
  _emailFilter = '';
  _countryFilter: string;
  displayedColumns = ['select', 'name', 'email', 'mobile', 'country', 'action'];
  columnsToDisplay = ['footer'];
  public filterObservable$: Subject<string> = new Subject<string>();
  @ViewChild('paginator') paginator: MatPaginator;
  selection = new SelectionModel<Supplier>(true, []);

  public get NameFilter(): string {
    return this._nameFilter;
  }
  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `name:${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get EmailFilter(): string {
    return this._emailFilter;
  }
  public set EmailFilter(v: string) {
    this._emailFilter = v;
    const emailFilter = `email:${v}`;
    this.filterObservable$.next(emailFilter);
  }

  public get MobileFilter(): string {
    return this._mobileFilter;
  }
  public set MobileFilter(v: string) {
    this._mobileFilter = v;
    const mobileFilter = `mobile:${v}`;
    this.filterObservable$.next(mobileFilter);
  }

  public get CountryFilter(): string {
    return this._countryFilter;
  }

  public set CountryFilter(v: string) {
    this._countryFilter = v;
    const countryFilter = `country:${v}`;
    this.filterObservable$.next(countryFilter);
  }

  constructor(
    private supplierService: SupplierService,
    public dialogRef: MatDialogRef<ChemicalSuppliersComponent>,
    private commonDialogService: CommonDialogService,
    private supplierChemicalService: SupplierChemicalService,
    private toasterService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Chemical,
    private dialog: MatDialog,
    private translationService: TranslationService,
    private commonService: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.getCountries();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        if (this.paginator)
          this.paginator.firstPage();
        this.getSuppliersList();
      });
    if (this.data) {
      this.isLoading = true;
      this.getSuppliersList();
    }
  }

  getSuppliersList() {
    let supplierResourceParameter = new SupplierResourceParameter();
    supplierResourceParameter.chemicalId = this.data.id;
    supplierResourceParameter.skip = this.skip;
    supplierResourceParameter.pageSize = this.pageSize;
    supplierResourceParameter.supplierName = this.NameFilter;
    supplierResourceParameter.email = this.EmailFilter;
    supplierResourceParameter.mobileNo = this.MobileFilter;
    supplierResourceParameter.country = this.CountryFilter ? this.CountryFilter : '';
    this.isLoading = true;
    this.sub$.sink = this.supplierService
      .getSuppliersByChemicalId(supplierResourceParameter)
      .subscribe((c) => {
        this.suppliers = c.suppliers;
        this.totalSuppliers = c.totalCount;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
  }

  public pageChange(event: PageEvent): void {
    this.skip = event.pageIndex * event.pageSize;
    this.getSuppliersList();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getCountries() {
    this.sub$.sink = this.commonService.getCountry().subscribe(c => this.countryList = c);
  }

  removeSupplierFromChemial(supplier: Supplier) {
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${supplier.supplierName} ?`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.sub$.sink = this.supplierChemicalService.deleteSupplierChemcial(this.data.id, supplier.id).subscribe(data => {
            this.toasterService.success(this.translationService.getValue('SUPPLIER_DELETED_SUCCESSFULLY'))
            this.getSuppliersList();
          });
        }
      });
  }
  addChemicalSupplier() {
    const dialogRef = this.dialog.open(AddChemicalSupplierComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, this.data)
    });
    this.sub$.sink = dialogRef.afterClosed()
      .subscribe(result => {
        if (result["flag"])
          this.getSuppliersList();
      });

  }
  sendEmail() {
    const sendEmailSuppliers: SendEmailSuppliers = {
      suppliers: this.selection.selected.filter(c => {
        if (c.email) {
          return true;
        }
        return false;
      }),
      chemicalId: this.data.id,
      chemicalName: this.data.name
    }
    this.dialog.open(SendEmailComponent, {
      width: '60vw',
      height: 'auto',
      data: Object.assign({}, sendEmailSuppliers)
    });
  }
}
