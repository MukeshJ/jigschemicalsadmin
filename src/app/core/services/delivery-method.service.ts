import { Injectable } from '@angular/core';
import { DeliveryMethod } from '@core/domain-classes/delivery-method';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class DeliveryMethodService extends EntityCollectionServiceBase<DeliveryMethod>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('DeliveryMethod', serviceElementsFactory);
  }

}
