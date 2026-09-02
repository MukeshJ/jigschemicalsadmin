import { PurchaseOrder } from "./purchase-order";

export class PurchaseOrderPayment {
      id:number;
      purchaseOrderId:number
      purchaseOrder: PurchaseOrder; 
      orderNumber?: string;
      paymentDate:Date; 
      referenceNumber:string;
      amount:number; 
     //PaymentMethod PaymentMethod { get; set; }
      note:string;
      attachmentUrl:string;
      attachmentData:string;
      paymentMethod?: string;
}