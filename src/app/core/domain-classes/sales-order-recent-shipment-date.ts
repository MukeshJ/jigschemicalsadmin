export interface SalesOrderRecentShipmentDate{
  salesOrderId: string;
  salesOrderNumber: string;
  expectedShipmentDate: Date;
  quantity: number;
  chemicalId: string;
  chemicalName: string;
  customerId: string;
  customerName: string;
}
