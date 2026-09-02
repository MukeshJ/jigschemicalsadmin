import { SalesOrder } from "./sales-order";

export class SalesOrderPayment{
      id:number;
      salesOrderId:number
      salesOrder: SalesOrder; 
      paymentDate:Date; 
      referenceNumber:string;
      amount:number; 
      orderNumber?: string;
     //PaymentMethod PaymentMethod { get; set; }
      note:string;
      attachmentUrl:string;
      attachmentData:string;
      paymentMethod?: number;
}