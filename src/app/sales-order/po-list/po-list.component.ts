import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { PurchaseOrderShort } from '@core/domain-classes/purchase-order/purchase-order-short';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { ClonerService } from '@core/services/clone.service';
import { ToastrService } from 'ngx-toastr';
import { SalesOrderService } from '../sales-order.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss'],
  imports: [
    MatProgressSpinner,
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
    TranslatePipe,
  ],
})
export class PoListComponent implements OnInit, OnChanges {
  @Input() saleOrder: SalesOrder;
  isLoading = false;
  displayedColumns = ['purchaseOrderName', 'supplierName', 'quantity'];
  purchaseOrderList: PurchaseOrderShort[] = [];
  constructor(
    private salesOrderService: SalesOrderService,
    private clonerService: ClonerService,
    private dailog: MatDialog,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saleOrder']) {
      this.getPurchaseOrderBySalesOrderId();
    }
  }

  getPurchaseOrderBySalesOrderId() {
    this.isLoading = true;
    this.salesOrderService.getPurchaseOrderBySoId(this.saleOrder.id).subscribe(
      (data: PurchaseOrderShort[]) => {
        this.isLoading = false;
        this.purchaseOrderList = data;
      },
      () => (this.isLoading = false),
    );
  }

  onSupplierRedirect(purchaseOrderShort: PurchaseOrderShort) {
    this.router.navigate(['supplier', 'manage', purchaseOrderShort.supplierId]);
  }
}
