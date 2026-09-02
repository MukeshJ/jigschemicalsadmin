export class InventoryHistory {
    id?: string;
    chemicalId?: string;
    stock: number;
    inventorySource: number;
    pricePerUnit: number;
    createdDate: string;
    purchaseOrderNumber?: string;
    purchaseOrderId?: string;
    salesOrderNumber?: string;
    salesOrderId?: string;
}