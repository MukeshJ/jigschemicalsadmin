import { ResourceParameter } from '../resource-parameter';
import { PurchaseOrderStatusEnum } from './purchase-order-status';

export class PurchaseOrderResourceParameter extends ResourceParameter {
    orderNumber?: string = '';
    supplierName?: string = '';
    chemicalName?: string = '';
    chemicalId?: string ='';
    pOCreatedDate?: Date;
    supplierId?: string = '';
    isPurchaseOrderRequest: boolean = false;
    fromDate?: Date;
    toDate?: Date;
    status?: PurchaseOrderStatusEnum = PurchaseOrderStatusEnum.All;
}
