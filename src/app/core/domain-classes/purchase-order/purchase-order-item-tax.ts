import { Tax } from '../tax';

export interface PurchaseOrderItemTax{
  id?: string;
  purchaseOrderItemId?: string;
  taxId: string;
  taxName?: string;
  taxPercentage?: string;
  tax?: Tax;
}
