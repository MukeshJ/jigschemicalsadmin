import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryMethodListComponent } from './delivery-method-list/delivery-method-list.component';
import { DeliveryMethodListPresentationComponent } from './delivery-method-list-presentation/delivery-method-list-presentation.component';
import { ManageDeliveryMethodComponent } from './manage-delivery-method/manage-delivery-method.component';
import { DeliveryMethodRoutingModule } from './delivery-method-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DeliveryMethodRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule,
    DeliveryMethodListComponent,
    DeliveryMethodListPresentationComponent,
    ManageDeliveryMethodComponent,
  ],
})
export class DeliveryMethodModule {}
