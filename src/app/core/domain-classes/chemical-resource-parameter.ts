import { ResourceParameter } from './resource-parameter';

export class ChemicalResourceParameter extends ResourceParameter {
  casNumber?: string = '';
  chemicalId?: string = '';
  isShowFront?: string = 'all';
  categoryId?: string = '';
  industryId?: string = '';
  industryName?: string = '';
  categoryName?: string = '';
}
