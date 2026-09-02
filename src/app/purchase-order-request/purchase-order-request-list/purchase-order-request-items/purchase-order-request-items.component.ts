import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { CurrencyPipe } from '@angular/common';
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
import { CustomCurrencyPipe } from '../../../shared/pipes/custome-currency.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-purchase-order-request-items',
  templateUrl: './purchase-order-request-items.component.html',
  styleUrls: ['./purchase-order-request-items.component.scss'],
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
    CurrencyPipe,
    CustomCurrencyPipe,
    TranslatePipe,
  ],
})
export class PurchaseOrderRequestItemsComponent implements OnInit, OnChanges {
  @Input() purchaseOrder: PurchaseOrder;
  purchaseOrderItems: PurchaseOrderItem[] = [];
  isLoading = false;
  displayedColumns: string[] = [
    'chemicalName',
    'unitName',
    'unitPrice',
    'quantity',
    'totalDiscount',
    'taxes',
    'totalTax',
    'totalAmount',
  ];

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['purchaseOrder']) {
      this.getPurchaseOrderItems();
    }
  }

  getPurchaseOrderItems() {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderItems(this.purchaseOrder.id).subscribe(
      (data: PurchaseOrderItem[]) => {
        this.isLoading = false;
        this.purchaseOrderItems = data;
      },
      () => (this.isLoading = false),
    );
  }
}
