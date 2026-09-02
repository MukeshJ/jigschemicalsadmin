import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order/purchase-order-item';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';

@Component({
  selector: 'app-purchase-order-return-item',
  templateUrl: './purchase-order-return-item.component.html',
  styleUrls: ['./purchase-order-return-item.component.scss']
})
export class PurchaseOrderReturnItemComponent implements OnInit {
  @Input() purchaseOrder: PurchaseOrder;
  purchaseOrderItems: PurchaseOrderItem[] = [];
  isLoading = false;
  displayedColumns: string[] = ['chemicalName', 'source', 'unitName', 'unitPrice', 'quantity', 'totalDiscount', 'taxes', 'totalTax', 'totalAmount'];

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
    this.purchaseOrderService.getPurchaseOrderItems(this.purchaseOrder.id, true)
      .subscribe((data: PurchaseOrderItem[]) => {
        this.isLoading = false;
        this.purchaseOrderItems = data;
      }, () => this.isLoading = false)
  }

}
