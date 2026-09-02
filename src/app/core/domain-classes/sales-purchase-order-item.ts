import { SalesOrder } from './sales-order';

export class SalesPurchaseOrderItem {
    id?: string;
    salesOrderId: string;
    purchaseOrderId: string;
    quantity: number;
    inStockQuantity?: number;
    purchaseOrderNumber?: string;
    pricePerUnit?: number;
    supplierName?: string;
    salesOrder?: SalesOrder;
}
