import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { SalesOrderService } from 'src/app/sales-order/sales-order.service';
import { NgIf, NgFor } from '@angular/common';
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
import { CustomCurrencyPipe } from '../../shared/pipes/custome-currency.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-order-return-item',
  templateUrl: './sales-order-return-item.component.html',
  styleUrls: ['./sales-order-return-item.component.scss'],
  imports: [
    NgIf,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    NgFor,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CustomCurrencyPipe,
    TranslatePipe,
  ],
})
export class SaleOrderReturnItemComponent implements OnInit {
  @Input() salesOrder: SalesOrder;
  salesOrderItems: SalesOrderItem[] = [];
  isLoading = false;
  displayedColumns: string[] = [
    'chemicalName',
    'source',
    'unitName',
    'unitPrice',
    'quantity',
    'totalDiscount',
    'taxes',
    'totalTax',
    'totalAmount',
  ];

  constructor(private salesOrderService: SalesOrderService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['salesOrder']) {
      this.getSalesOrderItems();
    }
  }

  getSalesOrderItems() {
    this.isLoading = true;
    this.salesOrderService.getSalesOrderItems(this.salesOrder.id, true).subscribe(
      (data: SalesOrderItem[]) => {
        this.isLoading = false;
        this.salesOrderItems = data;
      },
      () => (this.isLoading = false),
    );
  }
}
