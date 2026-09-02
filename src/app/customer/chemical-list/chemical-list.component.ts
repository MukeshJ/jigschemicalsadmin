import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Chemical } from '@core/domain-classes/chemical';
import { Customer } from '@core/domain-classes/customer';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { AddCustomerChemicalComponent } from '../add-customer-chemical/add-customer-chemical.component';
import { CustomerService } from '../customer.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chemical-list',
  templateUrl: './chemical-list.component.html',
  styleUrls: ['./chemical-list.component.scss'],
  imports: [
    HasClaimDirective,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FormsModule,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    TranslatePipe,
  ],
})
export class ChemicalListComponent extends BaseComponent implements OnInit {
  chemicals: Chemical[] = [];
  isLoading: boolean = false;
  skip: number = 0;
  pageSize: number = 10;
  totalChemicals = 0;
  _nameFilter = '';
  _casNumberFilter = '';
  displayedColumns = ['name', 'casNumber'];
  columnsToDisplay: string[] = ['footer'];
  public filterObservable$: Subject<string> = new Subject<string>();
  @ViewChild('paginator') paginator: MatPaginator;

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
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<ChemicalListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        if (this.paginator) this.paginator.firstPage();
        this.getChemicalsList();
      });
    if (this.data) {
      this.isLoading = true;
      this.getChemicalsList();
    }
  }

  getChemicalsList() {
    this.isLoading = true;
    this.sub$.sink = this.customerService
      .getChemicalsByCustomerId(
        this.data.id,
        this.skip,
        this.pageSize,
        this.NameFilter,
        this.CasNumberFilter,
      )
      .subscribe(
        (c) => {
          this.chemicals = c.chemicals;
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

  closeDialog() {
    this.dialogRef.close();
  }
  addChemicalCustomer() {
    const dialogRef = this.dialog.open(AddCustomerChemicalComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, this.data),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result['flag']) {
        this.getChemicalsList();
      }
    });
  }
}
