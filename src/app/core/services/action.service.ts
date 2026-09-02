import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Action } from '@core/domain-classes/action';

@Injectable({providedIn: 'root'})
export class ActionService extends EntityCollectionServiceBase<Action>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('Action', serviceElementsFactory);
  }

}
