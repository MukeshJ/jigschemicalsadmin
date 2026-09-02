import { Injectable } from '@angular/core';
import { PackagingType } from '@core/domain-classes/packaging-type';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class PackagingTypeService extends EntityCollectionServiceBase<PackagingType>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('PackagingType', serviceElementsFactory);
  }

}
