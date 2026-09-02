import { ResourceParameter } from "../resource-parameter";

export class InventoryResourceParameter extends ResourceParameter {
    id?: string;
    chemicalId?: string;
    stock: number;
    chemicalName: string;
}
