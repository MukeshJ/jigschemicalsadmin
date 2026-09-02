import { Injectable } from '@angular/core';
import { DocumentCategory } from '@core/domain-classes/document-category';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class DocumentCategoryService extends EntityCollectionServiceBase<DocumentCategory>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('DocumentCategory', serviceElementsFactory);
  }

}
