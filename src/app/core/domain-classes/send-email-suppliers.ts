import { Supplier } from './supplier';

export interface SendEmailSuppliers {
  suppliers: Supplier[];
  chemicalName: string;
  chemicalId: string;
}
