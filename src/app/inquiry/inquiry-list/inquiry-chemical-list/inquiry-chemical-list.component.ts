import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalSupplierCount } from '@core/domain-classes/chemical-supplier-count';
import { Inquiry } from '@core/domain-classes/inquiry';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalSuppliersComponent } from 'src/app/chemical-supplier/chemical-suppliers/chemical-suppliers.component';
import { InquiryService } from '../../inquiry.service';
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
import { NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-inquiry-chemical-list',
  templateUrl: './inquiry-chemical-list.component.html',
  styleUrls: ['./inquiry-chemical-list.component.scss'],
  imports: [
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
    NgIf,
    MatProgressSpinner,
    TruncatePipe,
    TranslatePipe,
  ],
})
export class InquiryChemicalListComponent extends BaseComponent implements OnInit {
  chemicals: ChemicalSupplierCount[] = [];
  isLoading: boolean = false;
  displayedColumns = ['name', 'casNumber', 'totalSupplier'];
  constructor(
    private inquiryService: InquiryService,
    public dialogRef: MatDialogRef<InquiryChemicalListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inquiry,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data) {
      this.getChemicalsList();
    }
  }

  getChemicalsList() {
    this.isLoading = true;
    this.sub$.sink = this.inquiryService.getChemicalsByInquiryId(this.data.id).subscribe(
      (c) => {
        this.chemicals = c;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  viewSuppliers(chemical: Chemical) {
    this.dialog.open(ChemicalSuppliersComponent, {
      width: '60vw',
      height: 'auto',
      data: Object.assign({}, chemical),
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
