
export interface Inventory {
    id?: string;
    chemicalId?: string;
    stock: number;
    pricePerUnit: number;
    chemicalName: string;
    unitName: string;
    averagePurchasePrice: number;
    averageSalesPrice:number;
}
