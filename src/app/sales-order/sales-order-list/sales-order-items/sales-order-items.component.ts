import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SalesOrder } from '@core/domain-classes/sales-order';
import { SalesOrderItem } from '@core/domain-classes/sales-order-item';
import { SalesOrderService } from '../../sales-order.service';
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
  selector: 'app-sales-order-items',
  templateUrl: './sales-order-items.component.html',
  styleUrls: ['./sales-order-items.component.scss'],
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
    CustomCurrencyPipe,
    TranslatePipe,
  ],
})
export class SalesOrderItemsComponent implements OnInit, OnChanges {
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
    this.salesOrderService.getSalesOrderItems(this.salesOrder.id).subscribe(
      (data: SalesOrderItem[]) => {
        this.isLoading = false;
        this.salesOrderItems = data;
      },
      () => (this.isLoading = false),
    );
  }
}
