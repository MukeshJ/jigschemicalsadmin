import { ResourceParameter } from "./resource-parameter";

export class SupplierResourceParameter extends ResourceParameter {
  id?: string;
  chemicalId?: string = '';
  supplierName: string = '';
  mobileNo: string = '';
  email: string = '';
  website?: string = '';
  country?: string = '';
}
