import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChemicalService } from '../chemical.service';
import { BaseComponent } from 'src/app/base.component';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { ChemicalDataSource } from './chemical-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from '@core/services/translation.service';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalCustomersComponent } from '../chemical-customers/chemical-customers.component';
import { AddChemicalCustomerComponent } from '../add-chemical-customer/add-chemical-customer.component';
import { ChemicalSuppliersComponent } from 'src/app/chemical-supplier/chemical-suppliers/chemical-suppliers.component';
import { AddChemicalSupplierComponent } from 'src/app/chemical-supplier/add-chemical-supplier/add-chemical-supplier.component';


@Component({
  standalone: false,
  selector: 'app-chemical-list',
  templateUrl: './chemical-list.component.html',
  styleUrls: ['./chemical-list.component.scss'],
})
export class ChemicalListComponent extends BaseComponent implements OnInit {
  dataSource: ChemicalDataSource;
  chemicalList: Chemical[] = [];
  checkedChemicalArray: Array<any> = [];
  chemicals: Chemical[] = [];
  displayedColumns: string[] = [
    'action',
    'name',
    'casNumber',
    'synonyms',
    'supplierCount',
    'customerCount',
    'categories',
    'industries',
    'isShowFront'
  ];
  footerToDisplayed: string[] = ['footer'];
  isLoadingResults = true;
  chemicalResource: ChemicalResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _nameFilter: string;
  _casNumberFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();

  selected: string = 'all'


  private _selectedFrontEnd: string = 'all';
  public get selectedFrontEnd(): string {
    return this._selectedFrontEnd;
  }
  public set selectedFrontEnd(v: string) {
    this._selectedFrontEnd = v;
    const nameFilter = `isFrontend:${v}`;
    this.filterObservable$.next(nameFilter);
  }


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
    private chemicalService: ChemicalService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private dialog: MatDialog,
    private router: Router,
    private translationService: TranslationService
  ) {
    super();
    this.chemicalResource = new ChemicalResourceParameter();
    this.chemicalResource.pageSize = 20;
    this.chemicalResource.orderBy = 'casNumber asc';
  }

  ngOnInit(): void {
    this.dataSource = new ChemicalDataSource(this.chemicalService);
    this.dataSource.loadData(this.chemicalResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.chemicalResource.skip = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'name') {
          this.chemicalResource.name = escape(strArray[1]);
        } else if (strArray[0] === 'casNumber') {
          this.chemicalResource.casNumber = strArray[1];
        }
        else if (strArray[0] === 'isFrontend') {
          this.chemicalResource.isShowFront = strArray[1];
        }
        this.dataSource.loadData(this.chemicalResource);
      });
  }

  onIsShowInFront(checked: boolean, id: string) {
    this.chemicalService.updateChemicalShowFrontendFlag(id, checked)
      .subscribe((c: boolean) => {
        this.dataSource.loadData(this.chemicalResource);
      });
  }

  ngAfterViewInit() {
    this.paginator.pageIndex =
      this.chemicalResource.skip / this.chemicalResource.pageSize;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.chemicalResource.skip =
            this.paginator.pageIndex * this.paginator.pageSize;
          this.chemicalResource.pageSize = this.paginator.pageSize;
          this.chemicalResource.orderBy =
            this.sort.active + ' ' + this.sort.direction;
          this.checkedChemicalArray = [];
          this.dataSource.loadData(this.chemicalResource);
        })
      )
      .subscribe();
  }

  deleteChemical(chemical: Chemical) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue(
          'ARE_YOU_SURE_YOU_WANT_TO_DELETE'
        )} ${chemical.name}`
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.chemicalService
            .deleteChemical(chemical.id)
            .subscribe(() => {
              this.toastrService.success(
                this.translationService.getValue(
                  'CHEMICAL_DELETED_SUCCESSFULLY'
                )
              );
              this.paginator.pageIndex = 0;
              this.chemicalResource.name = '';
              this.dataSource.loadData(this.chemicalResource);
            });
        }
      });
  }

  onChange(chemical: string, event: any) {
    if (event.checked) {
      this.checkedChemicalArray.push(chemical);
    } else {
      let index = this.checkedChemicalArray.indexOf(chemical);
      this.checkedChemicalArray.splice(index, 1);
    }
  }

  deleteAllChemical() {
    if (this.checkedChemicalArray.length > 0) {
      this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(
          `${this.translationService.getValue(
            'ARE_YOU_SURE_YOU_WANT_TO_DELETE'
          )}`
        )
        .subscribe((isTrue: boolean) => {
          if (isTrue) {
            this.sub$.sink = this.chemicalService
              .deleteAllChemical(this.checkedChemicalArray)
              .subscribe(() => {
                this.toastrService.success(
                  this.translationService.getValue(
                    'CHEMICAL_DELETED_SUCCESSFULLY'
                  )
                );
                // this.paginator.pageIndex = 0;
                this.chemicalResource.name = '';
                this.checkedChemicalArray = [];
                this.dataSource.loadData(this.chemicalResource);

              });
          }
        });
    } else {
      this.toastrService.error('Select At least One Product');
    }
  }

  // selecetAll(event: MatCheckboxChange) {
  //   if (event.checked) {
  //     this.pages.forEach(page => {
  //       this.actions.forEach(action => {
  //         if (this.checkPageAction(page.id, action.id)) {
  //           this.checkedChemicalArray.push({
  //             roleId: this.role.id,
  //             claimType: `${page.name}_${action.name}`,
  //             claimValue: '',
  //             pageId: page.id,
  //             actionId: action.id
  //           });
  //         }
  //       });
  //     });
  //   } else {
  //     this.checkedChemicalArray = [];
  //   }
  // }
  checkPermission(pageId: string): boolean {
    const pageAction = this.checkedChemicalArray.find(c => c.pageId === pageId);
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }
  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe(
      (c: ResponseHeader) => {
        if (c) {
          this.chemicalResource.pageSize = c.pageSize;
          this.chemicalResource.skip = c.skip;
          this.chemicalResource.totalCount = c.totalCount;
        }
      }
    );
  }

  editChemical(chemicalId: string) {
    this.router.navigate(['/chemical/', chemicalId]);
  }

  viewSuppliers(chemical: Chemical) {
    this.dialog.open(ChemicalSuppliersComponent, {
      height: 'auto',
      data: Object.assign({}, chemical),
    });
  }

  viewCustomers(chemical: Chemical) {
    this.dialog.open(ChemicalCustomersComponent, {
      height: 'auto',
      data: Object.assign({}, chemical),
    });
  }

  addChemicalSupplier(chemical: Chemical) {
    const dialogRef = this.dialog.open(AddChemicalSupplierComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, chemical),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result['flag']) {
        this.dataSource.loadData(this.chemicalResource);
      }
    });
  }
  addChemicalCustomer(chemical: Chemical) {
    const dialogRef = this.dialog.open(AddChemicalCustomerComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, chemical),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result['flag']) {
        this.dataSource.loadData(this.chemicalResource);
      }
    });
  }
}
