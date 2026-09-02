import { Chemical } from "../chemical";
import { PurchaseOrderItemTax } from "./purchase-order-item-tax";
import { PurchaseOrderStatusEnum } from "./purchase-order-status";

export interface PurchaseOrderItem{
  id?: string;
  chemicalId: string;
  purchaseOrderId?: string;
  unitPrice: number;
  quantity: number;
  taxValue?: number;
  discount: number;
  chemical?: Chemical;
  discountPercentage: number;
  status?: PurchaseOrderStatusEnum;
  unitName?: string;
  purchaseOrderItemTaxes: PurchaseOrderItemTax[]
  purchaseOrderNumber?: string;
  supplierName?: string;
  poCreatedDate?: Date;
  chemicalName?:string;
}
