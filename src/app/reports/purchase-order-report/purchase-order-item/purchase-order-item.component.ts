import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';

@Component({
  standalone: false,
  selector: 'app-purchase-order-report-item',
  templateUrl: './purchase-order-item.component.html',
  styleUrls: ['./purchase-order-item.component.scss']
})
export class PurchaseOrderItemComponent implements OnInit, OnChanges {
  @Input() purchaseOrder: PurchaseOrder;
  purchaseOrderItems: PurchaseOrderItem[] = [];
  isLoading = false;
  displayedColumns: string[] = ['chemicalName','source', 'unitName', 'unitPrice', 'quantity',  'totalDiscount', 'taxes', 'totalTax','totalAmount'];

  constructor(private purchaseOrderService: PurchaseOrderService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['purchaseOrder']) {
      this.getPurchaseOrderItems();
    }
  }

  getPurchaseOrderItems() {
    this.isLoading = true;
    this.purchaseOrderService.getPurchaseOrderItems(this.purchaseOrder.id)
      .subscribe((data: PurchaseOrderItem[]) => {
        this.isLoading = false;
        this.purchaseOrderItems = data;
      }, () => this.isLoading = false)
  }

}
