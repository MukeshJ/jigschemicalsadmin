import { Component, OnInit } from '@angular/core';
import { DeliveryMethod } from '@core/domain-classes/delivery-method';
import { DeliveryMethodService } from '@core/services/delivery-method.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  standalone: false,
  selector: 'app-delivery-method-list',
  templateUrl: './delivery-method-list.component.html',
  styleUrls: ['./delivery-method-list.component.scss']
})
export class DeliveryMethodListComponent extends BaseComponent implements OnInit {
  deliveryMethods$: Observable<DeliveryMethod[]>;
  loading$: Observable<boolean>;
  constructor(
    private deliveryMethodService: DeliveryMethodService,
    private toastrService: ToastrService,
    private translationService: TranslationService) {
    super();
  }
  ngOnInit(): void {

    this.loading$ = this.deliveryMethodService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getDeliveryMethods();
          }
        })
      )
    this.deliveryMethods$ = this.deliveryMethodService.entities$
  }

  getDeliveryMethods(): void {
    this.deliveryMethodService.getAll();
  }

  deleteDeliveryMethod(id: string): void {
    this.sub$.sink = this.deliveryMethodService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('DELIVERY_METHOD_DELETED_SUCCESSFULLY'));
    });
  }

  manageDeliveryMethod(deliveryMethod: DeliveryMethod): void {
    if (deliveryMethod.id) {
      this.sub$.sink = this.deliveryMethodService.update(deliveryMethod).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('DELIVERY_METHOD_UPDATED_SUCCESSFULLY'));
      });
    } else {
      this.sub$.sink = this.deliveryMethodService.add(deliveryMethod).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('DELIVERY_METHOD_SAVED_SUCCESSFULLY'));
      });
    }

  }
}

