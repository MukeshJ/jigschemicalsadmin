import { Chemical } from "./chemical";
import { PurchaseOrderStatusEnum } from "./purchase-order/purchase-order-status";
import { SalesOrderItemTax } from "./sales-order-item-tax";

export interface SalesOrderItem {
  id?: string;
  chemicalId: string;
  salesOrderId?: string;
  unitPrice: number;
  quantity: number;
  taxValue?: number;
  discount: number;
  chemical?: Chemical;
  discountPercentage: number;
  status?: PurchaseOrderStatusEnum;
  unitName?: string;
  salesOrderItemTaxes: SalesOrderItemTax[],
  chemicalName?: string;
  salesOrderNumber?: string;
  customerName?: string;
  soCreatedDate?: Date;
}
