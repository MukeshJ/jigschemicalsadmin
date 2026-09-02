import { ResourceParameter } from './resource-parameter';
import { SalesOrderStatusEnum } from './sales-order-status';

export class SalesOrderResource extends ResourceParameter {
  customerId?: string = '';
  customerName?:string ='';
  orderNumber?: string = '';
  soCreatedDate?: Date = null;
  chemicalId?: string = '';
  fromDate?: Date;
  toDate?: Date;
  isSalesOrderRequest: boolean = false;
  status?: SalesOrderStatusEnum = SalesOrderStatusEnum.All;
  chemicalName?: string;
}
