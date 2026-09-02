import { Injectable } from '@angular/core';
import { PaymentTerm } from '@core/domain-classes/payment-term';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class PaymentTermService extends EntityCollectionServiceBase<PaymentTerm>  {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
      super('PaymentTerm', serviceElementsFactory);
  }

}

