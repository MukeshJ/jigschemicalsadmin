import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentTermRoutingModule } from './payment-term-routing.module';
import { PaymentTermComponent } from './payment-term.component';
import { ManagePaymentTermComponent } from './manage-payment-term/manage-payment-term.component';
import { PaymentTermPresentationComponent } from './payment-term-presentation/payment-term-presentation.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PaymentTermRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule,
    PaymentTermComponent,
    ManagePaymentTermComponent,
    PaymentTermPresentationComponent,
  ],
})
export class PaymentTermModule {}
