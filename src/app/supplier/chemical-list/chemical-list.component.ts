import {
  Component,
  Inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Chemical } from '@core/domain-classes/chemical';
import { Supplier } from '@core/domain-classes/supplier';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { SupplierChemicalService } from 'src/app/supplier-chemical/supplier-chemical.service';
import { AddSupplierChemicalComponent } from '../add-supplier-chemical/add-supplier-chemical.component';
import { SupplierService } from '../supplier.service';
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
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chemical-list',
  templateUrl: './chemical-list.component.html',
  styleUrls: ['./chemical-list.component.scss'],
  imports: [
    HasClaimDirective,
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
    MatProgressSpinner,
    TranslatePipe,
    MatIconModule 
  ],
})
export class ChemicalListComponent extends BaseComponent implements OnInit {
  chemicals: Chemical[] = [];
  isLoadin = signal<boolean>(false);
  skip: number = 0;
  pageSize: number = 10;
  totalChemicals = 0;
  _nameFilter = '';
  _casNumberFilter = '';
  displayedColumns = ['name', 'casNumber', 'action'];
  columnsToDisplay = ['footer'];
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
    private supplierService: SupplierService,
    private commonDialogService: CommonDialogService,
    private supplierChemicalService: SupplierChemicalService,
    private toasterService: ToastrService,
    public dialogRef: MatDialogRef<ChemicalListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier,
    private dialog: MatDialog,
    private translationService: TranslationService,
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
      this.isLoadin.set(true);
      this.getChemicalsList();
    }
  }

 
  getChemicalsList(): void {
  this.isLoadin.set(true);

  this.sub$.sink = this.supplierService
    .getChemicalsBySupplierId(
      this.data.id,
      this.skip,
      this.pageSize,
      this.NameFilter,
      this.CasNumberFilter
    )
    .pipe(
      finalize(() => {
        this.isLoadin.set(false);
      })
    )
    .subscribe({
      next: (response) => {
        this.chemicals = response?.chemicals ?? [];
        this.totalChemicals = response?.totalCount ?? 0;
      },
      error: (error) => {
        this.toasterService.error(
          this.translationService.getValue(`${error}`)
        );
      }
    });
}

  removeChemialFromSupplier(chemical: Chemical) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE') + `${chemical.name} ?`,
      )
      .subscribe((isTrue) => {
        if (isTrue) {
          this.sub$.sink = this.supplierChemicalService
            .deleteSupplierChemcial(chemical.id, this.data.id)
            .subscribe((data) => {
              this.toasterService.success(
                this.translationService.getValue('CHEMICAL_DELETED_SUCCESSFULLY'),
              );
              this.getChemicalsList();
            });
        }
      });
  }

  public pageChange(event: PageEvent): void {
    this.skip = event.pageIndex * event.pageSize;
    this.getChemicalsList();
  }

  closeDialog() {
    this.dialogRef.close();
  }
  addChemicalSupplier() {
    const dialogRef = this.dialog.open(AddSupplierChemicalComponent, {
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
