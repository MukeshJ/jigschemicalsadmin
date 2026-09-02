import { Customer } from './customer';
import { DeliveryStatusEnum } from './delivery-status-enum';
import { PaymentStatus } from './payment-status';
import { SalesOrderAttachment } from './sales-order-attachment';
import { SalesOrderItem } from './sales-order-item';
import { SalesOrderStatusEnum } from './sales-order-status';
import { SalesPurchaseOrderItem } from "./sales-purchase-order-item";

export class  SalesOrder {
  id?: string;
  customerId?: string;
  customerName?: string;
  orderNumber: string;
  reference?: string;
  soCreatedDate: Date;
  paymentTermId?: string;
  deliveryMethodId?: string;
  deliveryDate: Date;
  totalAmount: number;
  totalDiscount: number;
  totalTax: number;
  totalPaidAmount?: number;
  totalQuantity?:number
  isClosed?: boolean;
  closedDate?: Date;
  note?: string;
  termAndCondition?: string;
  customer?: Customer;
  salesOrderStatus: SalesOrderStatusEnum;
  salesOrderAttachments?: SalesOrderAttachment[]
  deliveryStatus: DeliveryStatusEnum;
  salesOrderItems: SalesOrderItem[];
  isSalesOrderRequest?: boolean;
  status?: number;
  paymentStatus?: PaymentStatus
}
