import { Category } from './category';
import { DocumentInfo } from './document-info';

export interface DocumentCategories {
  document: DocumentInfo;
  categories: Category[];
}
