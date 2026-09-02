import { Chemical } from '../chemical';
import { PackagingType } from '../packaging-type';
import { PurchaseOrderAttachment } from './purchase-order-attachment';
import { Supplier } from '../supplier';
import { PaymentStatus } from '../payment-status';
import { PurchaseOrderItem } from './purchase-order-item';
import { PurchaseOrderPayment } from './purchase-order-payment';
import { DeliveryStatusEnum } from '../delivery-status-enum';
import { PurchaseOrderStatusEnum } from './purchase-order-status';

export interface PurchaseOrder {
  id?: string;
  orderNumber: string;
  poCreatedDate: Date;
  closedDate?: Date;
  isClosed?: boolean;
  supplierId: string;
  supplierName?: string;
  isStockAtSupplierWarehouse: boolean;
  isPurchaseOrderRequest: boolean;
  supplierInvoiceNumber: string;
  supplier?: Supplier;
  chemical?: Chemical;
  packagingTypeId: string;
  packagingType?: PackagingType;
  purchaseOrderStatus: PurchaseOrderStatusEnum;
  note?: string;
  termAndCondition?: string;
  deliveryDate: Date;
  totalAmount: number;
  totalTax: number;
  totalQuantity?: number;
  totalDiscount: number;
  totalPaidAmount?: number;
  paymentStatus?: PaymentStatus;
  deliveryStatus: DeliveryStatusEnum;
  purchaseOrderAttachments?: PurchaseOrderAttachment[];
  purchaseOrderItems: PurchaseOrderItem[];
  purchaseOrderPayments?: PurchaseOrderPayment[],
  status?: number;
}
