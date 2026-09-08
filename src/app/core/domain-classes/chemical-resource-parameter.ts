import { ResourceParameter } from './resource-parameter';

export class ChemicalResourceParameter extends ResourceParameter {
  casNumber?: string = '';
  chemicalId?: string = '';
  isShowFront?: string = 'all';
  categoryId?: string = '';
  industryId?: string = '';
  industryName?: string = '';
  categoryName?: string = '';
  // mat-sort state kept alongside the query params (mirrors CaseParameter)
  sortActive?: string = '';
  sortDirection?: 'asc' | 'desc' | '' = '';
}
