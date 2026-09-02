import { ResourceParameter } from './resource-parameter';
import { SalesOrderStatusEnum } from './sales-order-status';

export class SalesOrderResourceParameter extends ResourceParameter {
    orderNumber?: string = '';
    customerName?: string = '';
    sOCreatedDate?: Date;
    customerId?: string = '';
    chemicalId: string;
    fromDate?: Date;
    toDate?: Date;
    isSalesOrderRequest: boolean = false;
    status?: SalesOrderStatusEnum = SalesOrderStatusEnum.All;
    chemicalName?: string;
}
