import { Component, OnInit, inject } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { Router, RouterLink } from '@angular/router';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from '@core/services/translation.service';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalCustomersComponent } from '../chemical-customers/chemical-customers.component';
import { AddChemicalCustomerComponent } from '../add-chemical-customer/add-chemical-customer.component';
import { ChemicalSuppliersComponent } from 'src/app/chemical-supplier/chemical-suppliers/chemical-suppliers.component';
import { AddChemicalSupplierComponent } from 'src/app/chemical-supplier/add-chemical-supplier/add-chemical-supplier.component';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { NgStyle } from '@angular/common';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { ChemicalLocalStore } from '../chemical-store';

@Component({
  selector: 'app-chemical-list',
  templateUrl: './chemical-list.component.html',
  styleUrls: ['./chemical-list.component.scss'],
  imports: [
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    HasClaimDirective,
    RouterLink,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatCheckbox,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatSortHeader,
    NgStyle,
    FormsModule,
    MatSelect,
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
  providers: [ChemicalLocalStore],
})
export class ChemicalListComponent extends BaseComponent {
  readonly chemicalStore = inject(ChemicalLocalStore);
  checkedChemicalArray: Array<any> = [];

  displayedColumns: string[] = [
    'action',
    'name',
    'casNumber',
    'synonyms',
    'supplierCount',
    'customerCount',
    'categories',
    'industries',
    'isShowFront',
  ];
  footerToDisplayed: string[] = ['footer'];

  constructor(
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private dialog: MatDialog,
    private router: Router,
    private translationService: TranslationService,
  ) {
    super();
  }
  
  deleteChemical(chemical: Chemical): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${chemical.name}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.chemicalStore.deleteChemical(chemical);
        }
      });
  }

  deleteAllChemical(): void {
    if (this.checkedChemicalArray.length > 0) {
      this.sub$.sink = this.commonDialogService
        .deleteConformationDialog(
          `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}`,
        )
        .subscribe((isTrue: boolean) => {
          if (isTrue) {
            this.chemicalStore.deleteAllChemical([...this.checkedChemicalArray]);
            this.checkedChemicalArray = [];
          }
        });
    } else {
      this.toastrService.error('Select At least One Product');
    }
  }

  // ----- row selection (local UI state) -----

  onChange(chemical: string, event: any): void {
    if (event.checked) {
      this.checkedChemicalArray.push(chemical);
    } else {
      const index = this.checkedChemicalArray.indexOf(chemical);
      this.checkedChemicalArray.splice(index, 1);
    }
  }

  checkPermission(pageId: string): boolean {
    const pageAction = this.checkedChemicalArray.find((c) => c.pageId === pageId);
    return pageAction ? true : false;
  }

  selecetAll(event: any): void {}

  // ----- navigation / dialogs -----

  editChemical(chemicalId: string): void {
    this.router.navigate(['/chemical/', chemicalId]);
  }

  viewSuppliers(chemical: Chemical): void {
    this.dialog.open(ChemicalSuppliersComponent, {
      height: 'auto',
      data: Object.assign({}, chemical),
    });
  }

  viewCustomers(chemical: Chemical): void {
    this.dialog.open(ChemicalCustomersComponent, {
      height: 'auto',
      data: Object.assign({}, chemical),
    });
  }

  addChemicalSupplier(chemical: Chemical): void {
    const dialogRef = this.dialog.open(AddChemicalSupplierComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, chemical),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result['flag']) {
        this.chemicalStore.refreshChemicals();
      }
    });
  }

  addChemicalCustomer(chemical: Chemical): void {
    const dialogRef = this.dialog.open(AddChemicalCustomerComponent, {
      width: '40vw',
      height: 'auto',
      data: Object.assign({}, chemical),
    });
    this.sub$.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result && result['flag']) {
        this.chemicalStore.refreshChemicals();
      }
    });
  }
}
